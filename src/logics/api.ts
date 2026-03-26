import type {
	AuOptionCategoryDto,
	ExROptionPutRequest,
	ExRTabDto,
	UpdatedOptions,
} from "../type";

/**
 * API エンドポイントの定数定義
 * Node.js (Vitest) 環境での相対パス問題を解決するため、絶対URLを生成します。
 */
function getAbsoluteUrl(path: string): string {
	const baseUrl = import.meta.env.BASE_URL ?? "/";
	const fullPath = `${baseUrl}${path}`.replace(/\/+/g, "/");

	if (typeof window !== "undefined") {
		return new URL(fullPath, window.location.origin).toString();
	}
	// フォールバック (主にテスト環境用)
	return new URL(fullPath, "http://localhost:5173").toString();
}

const EXR_OPTION_URL = getAbsoluteUrl("exr/option/");
const AU_OPTION_URL = getAbsoluteUrl("au/option/");

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
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
	return Promise.all([getExrOptions(), getAuOptions()]);
}

/**
 * ExRオプションを更新する
 */
export async function updateExrOption(
	params: ExROptionPutRequest,
): Promise<UpdatedOptions | null> {
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

	if (res.status === 202) {
		return null;
	}

	return res.json();
}

/**
 * ExRオプションのキャッシュを差分更新する
 */
export async function updateExrOptionsCache(updatedData: UpdatedOptions) {
	if (!exrOptionsPromise) {
		return;
	}

	// 複数の更新が並列で走った際のレースコンディションを防ぐため、
	// Promiseを連鎖させて順次実行されるようにします。
	exrOptionsPromise = (async () => {
		const currentTabs = await exrOptionsPromise!;
		const newTabs = [...currentTabs];

		// UpdatedCategory の反映
		if (updatedData.UpdatedCategory) {
			const cat = updatedData.UpdatedCategory;
			for (let i = 0; i < newTabs.length; i++) {
				const tab = newTabs[i];
				const categoryIndex = tab.Categories.findIndex((c) => {
					return c.Id === cat.Id;
				});
				if (categoryIndex !== -1) {
					const newCategories = [...tab.Categories];
					newCategories[categoryIndex] = cat;
					newTabs[i] = { ...tab, Categories: newCategories };
				}
			}
		}

		// ChainUpdatedOption の反映
		for (const chain of updatedData.ChainUpdatedOption) {
			for (let i = 0; i < newTabs.length; i++) {
				const tab = newTabs[i];
				const categoryIndex = tab.Categories.findIndex((c) => {
					return c.Id === chain.Id;
				});
				if (categoryIndex !== -1) {
					const targetCategory = tab.Categories[categoryIndex];
					const newOptions = [...targetCategory.Options];

					for (const newOpt of chain.Options) {
						const optIndex = newOptions.findIndex((o) => {
							return o.Id === newOpt.Id;
						});
						if (optIndex !== -1) {
							newOptions[optIndex] = newOpt;
						} else {
							newOptions.push(newOpt);
						}
					}

					const newCategories = [...tab.Categories];
					newCategories[categoryIndex] = {
						...targetCategory,
						Options: newOptions,
					};
					newTabs[i] = { ...tab, Categories: newCategories };
				}
			}
		}

		return newTabs;
	})();

	// 更新完了を待機
	await exrOptionsPromise;
}
