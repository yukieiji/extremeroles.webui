import type {
	AuOptionCategoryDto,
	ExROptionDto,
	ExROptionPutRequest,
	ExRTabDto,
	UpdatedOptions,
} from "../type";

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = "/exr/option/";
const AU_OPTION_URL = "/au/option/";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let exrOptionsPromise: Promise<ExRTabDto[]> | null = null;
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrOptionsPromise = null;
	auOptionsPromise = null;
}

/**
 * キャッシュされているExRオプションのデータを更新する
 */
export function updateExrOptionsCache(
	updates: UpdatedOptions,
	tabId: number,
): void {
	if (!exrOptionsPromise) {
		return;
	}

	exrOptionsPromise = exrOptionsPromise.then((currentData) => {
		return applyUpdates(currentData, updates, tabId);
	});
}

/**
 * オプションのデータ構造に更新を適用する
 */
function applyUpdates(
	tabs: ExRTabDto[],
	updates: UpdatedOptions,
	tabId: number,
): ExRTabDto[] {
	return tabs.map((tab) => {
		if (tab.Id !== tabId) {
			return tab;
		}

		let newCategories = tab.Categories;
		if (updates.UpdatedCategory) {
			newCategories = newCategories.map((cat) => {
				return cat.Id === updates.UpdatedCategory?.Id
					? updates.UpdatedCategory
					: cat;
			});
		}

		if (updates.ChainUpdatedOption.length > 0) {
			newCategories = newCategories.map((cat) => {
				return {
					...cat,
					Options: cat.Options.map((opt) => {
						return updateOptionRecursive(opt, updates.ChainUpdatedOption);
					}),
				};
			});
		}

		return { ...tab, Categories: newCategories };
	});
}

/**
 * 再帰的にオプションを更新する
 */
function updateOptionRecursive(
	option: ExROptionDto,
	chainUpdates: ExROptionDto[],
): ExROptionDto {
	const update = chainUpdates.find((u) => {
		return u.Id === option.Id;
	});
	const newOption = update ? { ...update } : { ...option };

	if (newOption.Childs.length > 0) {
		newOption.Childs = newOption.Childs.map((child) => {
			return updateOptionRecursive(child, chainUpdates);
		});
	}

	return newOption;
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
		return res.json();
	})();

	return exrOptionsPromise;
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
 * ExRオプションを更新する
 */
export async function updateExrOption(
	params: ExROptionPutRequest,
): Promise<UpdatedOptions> {
	const res = await fetch(EXR_OPTION_URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	});

	if (!res.ok) {
		throw new Error(`Failed to update ExR option: ${res.statusText}`);
	}

	const updated: UpdatedOptions = await res.json();

	// キャッシュを更新
	updateExrOptionsCache(updated, params.TabId);

	return updated;
}

/**
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
	return Promise.all([getExrOptions(), getAuOptions()]);
}
