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
		const updatePromises: Promise<unknown>[] = [];

		// 1. UpdatedCategory があれば、該当するカテゴリを差し替える
		if (result.UpdatedCategory) {
			const updatedCategory = result.UpdatedCategory;
			const categoryId = updatedCategory.Id;

			// Promise マップを即座に更新 (O(1))
			const categoryPromise = Promise.resolve(updatedCategory);
			exrCategoryPromises.set(categoryId, categoryPromise);
			updatePromises.push(categoryPromise);

			// currentExrTabs 内の参照も更新
			for (const tab of currentExrTabs) {
				const index = tab.Categories.findIndex((c) => c.Id === categoryId);
				if (index !== -1) {
					tab.Categories[index] = updatedCategory;
					const tabPromise = Promise.resolve(tab);
					exrTabPromises.set(tab.Id, tabPromise);
					updatePromises.push(tabPromise);
				}
			}
		}

		// 2. ChainUpdatedOption があれば、それらも更新する
		for (const chainUpdate of result.ChainUpdatedOption) {
			const categoryId = chainUpdate.Id;
			const cachedCategoryPromise = exrCategoryPromises.get(categoryId);

			if (cachedCategoryPromise) {
				const updatedPromise = cachedCategoryPromise.then((category) => {
					category.Options = chainUpdate.Options;
					return category;
				});
				exrCategoryPromises.set(categoryId, updatedPromise);
				updatePromises.push(updatedPromise);

				// 該当するタブの Promise も更新が必要
				for (const tab of currentExrTabs) {
					if (tab.Categories.some((c) => c.Id === categoryId)) {
						const tabPromise = Promise.resolve(tab);
						exrTabPromises.set(tab.Id, tabPromise);
						updatePromises.push(tabPromise);
					}
				}
			}
		}

		// すべての更新が完了したことを保証する Promise
		await Promise.all(updatePromises);
		exrAllTabsPromise = Promise.resolve(currentExrTabs);
	}

	return result;
}
