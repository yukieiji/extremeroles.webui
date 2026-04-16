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
let currentExrTabs: ExRTabDto[] | null = null;
const exrTabPromises = new Map<number, Promise<ExRTabDto>>();
const exrCategoryPromises = new Map<number, Promise<ExRCategoryDto>>();
const categoryToTabIdMap = new Map<number, number>();

let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;
const auCategoryPromises = new Map<string, Promise<AuOptionCategoryDto>>();

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrAllTabsPromise = null;
	currentExrTabs = null;
	exrTabPromises.clear();
	exrCategoryPromises.clear();
	categoryToTabIdMap.clear();
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
		currentExrTabs = data;

		// タブごとおよびカテゴリーごとのPromiseを事前に解決済みの状態でキャッシュに格納する
		for (const tab of data) {
			if (!exrTabPromises.has(tab.Id)) {
				exrTabPromises.set(tab.Id, Promise.resolve(tab));
			}
			for (const category of tab.Categories) {
				categoryToTabIdMap.set(category.Id, tab.Id);
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
	if (currentExrTabs) {
		// 1. UpdatedCategory があれば、該当するカテゴリを差し替える
		if (result.UpdatedCategory) {
			const updatedCategory = result.UpdatedCategory;
			const categoryId = updatedCategory.Id;

			// Promise マップを即座に更新 (O(1))
			exrCategoryPromises.set(categoryId, Promise.resolve(updatedCategory));

			// 該当するタブを Map から特定して更新 (O(1))
			const tabId = categoryToTabIdMap.get(categoryId);
			if (tabId !== undefined) {
				const tab = currentExrTabs.find((t) => t.Id === tabId);
				if (tab) {
					const index = tab.Categories.findIndex((c) => c.Id === categoryId);
					if (index !== -1) {
						tab.Categories[index] = updatedCategory;
						exrTabPromises.set(tab.Id, Promise.resolve(tab));
					}
				}
			}
		}

		// 2. ChainUpdatedOption があれば、それらも更新する
		for (const chainUpdate of result.ChainUpdatedOption) {
			const categoryId = chainUpdate.Id;
			const tabId = categoryToTabIdMap.get(categoryId);

			if (tabId !== undefined) {
				const tab = currentExrTabs.find((t) => t.Id === tabId);
				if (tab) {
					const category = tab.Categories.find((c) => c.Id === categoryId);
					if (category) {
						category.Options = chainUpdate.Options;
						exrCategoryPromises.set(categoryId, Promise.resolve(category));
						exrTabPromises.set(tabId, Promise.resolve(tab));
					}
				}
			}
		}

		// 全データのPromiseを更新
		exrAllTabsPromise = Promise.resolve(currentExrTabs);
	}

	return result;
}
