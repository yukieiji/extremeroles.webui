import type {
	AuOptionCategoryDto,
	ExRCategoryDto,
	ExROptionPutRequest,
	ExRTabDto,
	UpdatedOptions,
} from "../type";
import {
	AuOptionCategoryDtoArraySchema,
	ExRTabDtoArraySchema,
	UpdatedOptionsSchema,
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
let exrAllTabsPromise: Promise<ExRTabDto[]> | null = null;
const exrTabPromises = new Map<number, Promise<ExRTabDto>>();
const exrCategoryPromises = new Map<number, Promise<ExRCategoryDto>>();
const exrCategoriesMap = new Map<number, ExRCategoryDto>();

let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;
const auCategoryPromises = new Map<string, Promise<AuOptionCategoryDto>>();

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrAllTabsPromise = null;
	exrTabPromises.clear();
	exrCategoryPromises.clear();
	exrCategoriesMap.clear();
	auOptionsPromise = null;
	auCategoryPromises.clear();
}

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<ExRTabDto[]> {
	if (exrAllTabsPromise) {
		return exrAllTabsPromise;
	}

	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;

	exrAllTabsPromise = (async () => {
		if (delay > 0) {
			await new Promise((resolve) => {
				return setTimeout(resolve, delay);
			});
		}
		const res = await fetch(EXR_OPTION_URL);
		if (!res.ok) {
			throw new Error(`Failed to fetch ExR options: ${res.statusText}`);
		}
		const rawData = await res.json();
		const data = ExRTabDtoArraySchema.parse(rawData);

		// タブごとおよびカテゴリーごとのPromiseを事前に解決済みの状態でキャッシュに格納する
		for (const tab of data) {
			if (!exrTabPromises.has(tab.Id)) {
				exrTabPromises.set(tab.Id, Promise.resolve(tab));
			}
			for (const category of tab.Categories) {
				exrCategoriesMap.set(category.Id, category);
				if (!exrCategoryPromises.has(category.Id)) {
					exrCategoryPromises.set(category.Id, Promise.resolve(category));
				}
			}
		}

		return data;
	})();

	return exrAllTabsPromise;
}

/**
 * 特定のExRタブのオプションを取得する
 */
export function getExrTabOptions(tabId: number): Promise<ExRTabDto> {
	const cached = exrTabPromises.get(tabId);
	if (cached) {
		return cached;
	}

	const promise = getExrOptions().then((tabs) => {
		const tab = tabs.find((t) => t.Id === tabId);
		if (!tab) {
			throw new Error(`ExR tab not found: ${tabId}`);
		}
		return tab;
	});

	exrTabPromises.set(tabId, promise);
	return promise;
}

/**
 * 特定のExRカテゴリーのオプションを取得する
 */
export function getExrCategoryOptions(
	categoryId: number,
): Promise<ExRCategoryDto> {
	const cached = exrCategoryPromises.get(categoryId);
	if (cached) {
		return cached;
	}

	const promise = getExrOptions().then((tabs) => {
		for (const tab of tabs) {
			const category = tab.Categories.find((c) => c.Id === categoryId);
			if (category) {
				return category;
			}
		}
		throw new Error(`ExR category not found: ${categoryId}`);
	});

	exrCategoryPromises.set(categoryId, promise);
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
		const rawData = await res.json();
		const data = AuOptionCategoryDtoArraySchema.parse(rawData);

		// カテゴリーごとのPromiseを事前に解決済みの状態でキャッシュに格納する
		for (const category of data) {
			if (!auCategoryPromises.has(category.TranslatedTitle)) {
				auCategoryPromises.set(
					category.TranslatedTitle,
					Promise.resolve(category),
				);
			}
		}

		return data;
	})();

	return auOptionsPromise;
}

/**
 * 特定のAuカテゴリーのオプションを取得する
 */
export function getAuCategoryOptions(
	categoryName: string,
): Promise<AuOptionCategoryDto> {
	const cached = auCategoryPromises.get(categoryName);
	if (cached) {
		return cached;
	}

	const promise = getAuOptions().then((categories) => {
		const category = categories.find((c) => c.TranslatedTitle === categoryName);
		if (!category) {
			throw new Error(`Au category not found: ${categoryName}`);
		}
		return category;
	});

	auCategoryPromises.set(categoryName, promise);
	return promise;
}

/**
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
	return Promise.all([getExrOptions(), getAuOptions()]);
}

/**
 * オプションのリストを再帰的に走査し、部分的な更新を適用します。
 */
function applyPartialOptionsUpdate(
	baseOptions: ExROptionDto[],
	updatedOptions: ExROptionDto[],
) {
	for (const updated of updatedOptions) {
		const target = baseOptions.find((o) => o.Id === updated.Id);
		if (target) {
			// プロパティを更新
			target.IsActive = updated.IsActive;
			target.Selection = updated.Selection;
			target.TranslatedName = updated.TranslatedName;
			target.Format = updated.Format;
			target.RangeMeta = updated.RangeMeta;

			// 子要素も再帰的に更新が必要な場合は、ここで処理
			if (updated.Childs && updated.Childs.length > 0) {
				applyPartialOptionsUpdate(target.Childs, updated.Childs);
			}
		} else {
			// トップレベルに見つからない場合、既存の各オプションの子要素を探す
			for (const base of baseOptions) {
				if (base.Childs && base.Childs.length > 0) {
					applyPartialOptionsUpdate(base.Childs, [updated]);
				}
			}
		}
	}
}

/**
 * ExRオプションを更新する
 */
export async function updateExrOption(
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

	const rawData = await res.json();
	const result = UpdatedOptionsSchema.parse(rawData);

	// キャッシュの更新
	// 1. UpdatedCategory があれば、該当するカテゴリを差し替える
	if (result.UpdatedCategory) {
		const updatedCategory = result.UpdatedCategory;
		const categoryId = updatedCategory.Id;

		// Promise マップを即座に更新 (O(1))
		exrCategoryPromises.set(categoryId, Promise.resolve(updatedCategory));

		// カテゴリの実体の参照も更新 (O(1))
		const cachedCategory = exrCategoriesMap.get(categoryId);
		if (cachedCategory) {
			cachedCategory.Options = updatedCategory.Options;
		}
	}

	// 2. ChainUpdatedOption があれば、それらも部分的に更新する
	for (const chainUpdate of result.ChainUpdatedOption) {
		const categoryId = chainUpdate.Id;
		const cachedCategory = exrCategoriesMap.get(categoryId);

		if (cachedCategory) {
			// カテゴリ全体の Options を上書きするのではなく、部分的に更新を適用
			applyPartialOptionsUpdate(cachedCategory.Options, chainUpdate.Options);

			// 影響を受けるコンポーネントを再レンダリングさせるため、新しい Promise をセット
			// 参照が同一でも Promise が新しければ use() は再評価される
			exrCategoryPromises.set(categoryId, Promise.resolve(cachedCategory));
		}
	}

	return result;
}
