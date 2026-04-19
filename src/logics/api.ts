import type {
	AuOptionCategoryDto,
	ExROptionDto,
	ExROptionMetaDataRecords,
	ExROptionValueData,
	UpdatedOptions,
} from "../type";
import { ExRTabDtoArraySchema, OptionTab, UpdatedOptionsSchema } from "../type";

import { useStore } from "../useStore";
import { getUniqueOptionId } from "./optionUtils";

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = "/exr/option/";
const AU_OPTION_URL = "/au/option/";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let exrOptionsPromise: Promise<void> | null = null;
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;

export const exrOptionMetaData: ExROptionMetaDataRecords = {
	// OptionTabはAPIから取得したデータに基づいて動的に構築され全てあることが保証されるため、初期値は空のオブジェクトで問題ありません
	tabInfo: {} as Record<OptionTab, string>,
	tabIdMap: {} as Record<OptionTab, number[]>,
	categoryTabMap: {} as Record<number, OptionTab>,
	categoryInfo: {},
	globalCategoryIdTopLevelMap: {},
	optionMetaData: {},
	childOptionMap: {},
};

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrOptionsPromise = null;
	auOptionsPromise = null;
}

/**
 * ExRオプションのメタデータをリセットする（テスト用）
 */
export function resetExrOptionMetaData() {
	exrOptionMetaData.tabInfo = {} as Record<OptionTab, string>;
	exrOptionMetaData.tabIdMap = {} as Record<OptionTab, number[]>;
	exrOptionMetaData.categoryInfo = {};
	exrOptionMetaData.globalCategoryIdTopLevelMap = {};
	exrOptionMetaData.optionMetaData = {};
	exrOptionMetaData.childOptionMap = {};
}

async function createExROptionMetaData(delay: number): Promise<void> {
	if (delay > 0) {
		await new Promise((resolve) => {
			return setTimeout(resolve, delay);
		});
	}
	const res = await fetch(EXR_OPTION_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch ExR options: ${res.statusText}`);
	}

	const jsonData = await res.json();
	const data = await ExRTabDtoArraySchema.parseAsync(jsonData);

	const valueData: Record<number, ExROptionValueData> = {};
	const isOptionActive: Record<number, boolean> = {};

	const processOptions = (
		options: ExROptionDto[],
		tabId: OptionTab,
		categoryId: number,
		parentOptionId: number | null,
	) => {
		for (const opt of options) {
			const uniqueId = getUniqueOptionId(tabId, categoryId, opt.Id);

			exrOptionMetaData.optionMetaData[uniqueId] = {
				translatedName: opt.TranslatedName,
				format: opt.Format,
				type: opt.RangeMeta.Type,
			};

			valueData[uniqueId] = {
				selection: opt.Selection,
				values: opt.RangeMeta.Values,
			};
			isOptionActive[uniqueId] = opt.IsActive;
			if (parentOptionId !== null) {
				const parentUniqueId = getUniqueOptionId(
					tabId,
					categoryId,
					parentOptionId,
				);
				if (!exrOptionMetaData.childOptionMap[parentUniqueId]) {
					exrOptionMetaData.childOptionMap[parentUniqueId] = [];
				}
				exrOptionMetaData.childOptionMap[parentUniqueId].push(uniqueId);
			}

			if (opt.Childs && opt.Childs.length > 0) {
				processOptions(opt.Childs, tabId, categoryId, opt.Id);
			}
		}
	};

	for (const tab of data) {
		exrOptionMetaData.tabInfo[tab.Id] = tab.Name;
		exrOptionMetaData.tabIdMap[tab.Id] = tab.Categories.map((c) => c.Id);
		for (const category of tab.Categories) {
			exrOptionMetaData.categoryInfo[category.Id] = category.Name;
			exrOptionMetaData.categoryTabMap[category.Id] = tab.Id;
			if (tab.Id === OptionTab.GeneralTab) {
				// 一般タブのカテゴリは、トップレベルオプションIDを直接カテゴリIDに紐づける
				exrOptionMetaData.globalCategoryIdTopLevelMap[category.Id] =
					category.Options.map((o) =>
						getUniqueOptionId(tab.Id, category.Id, o.Id),
					); // カテゴリIDとそのカテゴリに属するオプションIDの対応を保存
			}
			processOptions(category.Options, tab.Id, category.Id, null);
		}
	}
	useStore.getState().setExROptions(valueData, isOptionActive);
}

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<void> {
	if (exrOptionsPromise) {
		return exrOptionsPromise;
	}
	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;
	exrOptionsPromise = createExROptionMetaData(delay);
	return exrOptionsPromise;
}

export async function updateExrOption(
	tabId: number,
	categoryId: number,
	optionId: number,
	selection: number,
): Promise<UpdatedOptions> {
	const request = {
		TabId: tabId,
		CategoryId: categoryId,
		OptionId: optionId,
		Selection: selection,
	};
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

	const jsonData = await res.json();
	return await UpdatedOptionsSchema.parseAsync(jsonData);
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
