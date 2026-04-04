import {
	type AuOptionCategoryDto,
	type ExROptionPutRequest,
	type ExRTabDto,
	ExRTabDtoArraySchema,
	type UpdatedOptions,
} from "../type";

/**
 * API エンドポイントの定数定義
 * テスト環境（Node.js/JSDOM）での相対パスエラーを避けるため、必要に応じてベースURLを付与します
 */
const getBaseUrl = () => {
	if (typeof window !== "undefined" && window.location.origin !== "null") {
		return window.location.origin;
	}
	return "";
};

const EXR_OPTION_URL = `${getBaseUrl()}/exr/option/`;
const AU_OPTION_URL = `${getBaseUrl()}/au/option/`;

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let exrOptionsPromise: Promise<ExRTabDto[]> | null = null;
const exrTabPromises: Record<number, Promise<ExRTabDto> | null> = {};
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrOptionsPromise = null;
	for (const key of Object.keys(exrTabPromises)) {
		delete exrTabPromises[Number(key)];
	}
	auOptionsPromise = null;
	cacheUpdateQueue = Promise.resolve();
}

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<ExRTabDto[]> {
	if (exrOptionsPromise) {
		return exrOptionsPromise;
	}

	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;

	exrOptionsPromise = (async () => {
		if (delay > 0) {
			await new Promise((resolve) => {
				return setTimeout(resolve, delay);
			});
		}
		const res = await fetch(EXR_OPTION_URL);
		if (!res.ok) {
			throw new Error(`Failed to fetch ExR options: ${res.statusText}`);
		}
		const json = await res.json();
		// スキーマバリデーションを通して、IDが文字列の場合（モックデータなど）を数値に変換する
		const data = ExRTabDtoArraySchema.parse(json);

		// タブごとのプロミスも個別にキャッシュ
		// すでに getExrTabOptions によって作成されているプロミスがある場合は、
		// そのインスタンスの同一性を維持するために上書きしない（解決を待つだけにする）
		for (const tab of data) {
			if (!exrTabPromises[tab.Id]) {
				exrTabPromises[tab.Id] = Promise.resolve(tab);
			}
		}

		return data;
	})();

	return exrOptionsPromise;
}

/**
 * 指定されたタブのExRオプションを取得する
 */
export function getExrTabOptions(tabId: number): Promise<ExRTabDto> {
	// キャッシュがあればそれを返す（同一インスタンスを維持）
	const existing = exrTabPromises[tabId];
	if (existing) {
		return existing;
	}

	// キャッシュがない場合は、全体の取得を待ってから該当するタブを返すプロミスを作成してキャッシュする
	const promise = (async () => {
		const allTabs = await getExrOptions();
		const tab = allTabs.find((t) => t.Id === tabId);
		if (!tab) {
			// 指定されたIDが見つからない場合は、最初のタブをフォールバックとして返す
			return allTabs[0];
		}
		return tab;
	})();

	exrTabPromises[tabId] = promise;
	return promise;
}

/**
 * Auオプションを取得する
 */
export function getAuOptions(): Promise<AuOptionCategoryDto[]> {
	if (auOptionsPromise) {
		return auOptionsPromise;
	}

	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;

	auOptionsPromise = (async () => {
		if (delay > 0) {
			await new Promise((resolve) => {
				return setTimeout(resolve, delay);
			});
		}
		const res = await fetch(AU_OPTION_URL);
		if (!res.ok) {
			throw new Error(`Failed to fetch Au options: ${res.statusText}`);
		}
		return res.json();
	})();

	return auOptionsPromise;
}

/**
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
	return Promise.all([getExrOptions(), getAuOptions()]);
}

/**
 * ExRオプションを更新する
 */
export async function putExrOption(
	request: ExROptionPutRequest,
): Promise<UpdatedOptions> {
	const res = await fetch(EXR_OPTION_URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!res.ok) {
		throw new Error(`Failed to update ExR option: ${res.statusText}`);
	}

	// 202/204などの空レスポンスを考慮する
	if (res.status === 202 || res.status === 204) {
		return {
			UpdatedCategory: null,
			ChainUpdatedOption: [],
		};
	}

	const data = await res.json();
	await updateExrOptionsCache(data);
	return data;
}

/**
 * 更新キューの処理を順序正しく行うための変数
 */
let cacheUpdateQueue: Promise<void> = Promise.resolve();

/**
 * ExRオプションのキャッシュを差分更新する
 */
export function updateExrOptionsCache(updatedData: UpdatedOptions) {
	if (!exrOptionsPromise) {
		return Promise.resolve();
	}

	// 複数の更新が同時に走った場合に、前の更新が終わるのを待ってから次に進むようにする
	cacheUpdateQueue = cacheUpdateQueue.then(async () => {
		const currentData = await (exrOptionsPromise as Promise<ExRTabDto[]>);
		const newData = currentData.map((tab) => {
			let isTabUpdated = false;
			const newCategories = tab.Categories.map((category) => {
				// UpdatedCategory が一致する場合、丸ごと差し替え
				if (
					updatedData.UpdatedCategory &&
					category.Id === updatedData.UpdatedCategory.Id
				) {
					isTabUpdated = true;
					return updatedData.UpdatedCategory;
				}

				// ChainUpdatedOption に含まれるカテゴリの場合、Options を更新
				const chainUpdate = updatedData.ChainUpdatedOption.find(
					(u) => u.Id === category.Id,
				);
				if (chainUpdate) {
					isTabUpdated = true;
					return {
						...category,
						Options: chainUpdate.Options,
					};
				}

				return category;
			});

			const newTab = {
				...tab,
				Categories: newCategories,
			};

			// タブが更新された場合、タブごとのプロミスも更新
			if (isTabUpdated) {
				exrTabPromises[tab.Id] = Promise.resolve(newTab);
			}

			return newTab;
		});

		exrOptionsPromise = Promise.resolve(newData);
	});

	return cacheUpdateQueue;
}
