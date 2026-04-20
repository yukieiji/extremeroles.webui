import type {
	AuOptionCategoryDto,
	AuOptionId,
	AuOptionMetaDataRecords,
	AuRoleOption,
	ExROptionDto,
	ExROptionMetaDataRecords,
	ExROptionValueData,
	UniqueOptionId,
	UpdatedOptions,
} from "../type";
import {
	AU_PREFIX,
	AuOptionCategoryDtoArraySchema,
	ExRTabDtoArraySchema,
	OptionTab,
	OptionValueType,
	UpdatedOptionsSchema,
} from "../type";

import { getAuOptionId, getUniqueOptionId } from "./optionUtils";

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = "/exr/option/";
export const AU_OPTION_URL = "/au/option/";

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

export const auOptionMetaData: AuOptionMetaDataRecords = {
	tabNames: [],
	tabCategoryMap: {},
	categoryMetaData: {},
	options: {},
};

/**
 * ExRオプションのメタデータをリセットする（テスト用）
 */
export function resetExrOptionMetaData() {
	exrOptionMetaData.tabInfo = {} as Record<OptionTab, string>;
	exrOptionMetaData.tabIdMap = {} as Record<OptionTab, number[]>;
	exrOptionMetaData.categoryInfo = {};
	exrOptionMetaData.categoryTabMap = {} as Record<number, OptionTab>;
	exrOptionMetaData.globalCategoryIdTopLevelMap = {};
	exrOptionMetaData.optionMetaData = {};
	exrOptionMetaData.childOptionMap = {};
}

/**
 * Auオプションのメタデータをリセットする（テスト用）
 */
export function resetAuOptionMetaData() {
	auOptionMetaData.tabNames = [];
	auOptionMetaData.tabCategoryMap = {};
	auOptionMetaData.categoryMetaData = {};
	auOptionMetaData.options = {};
}

interface ExRinitializeData {
	valueData: Record<UniqueOptionId, ExROptionValueData>;
	isOptionActive: Record<UniqueOptionId, boolean>;
}

export async function createExROptionMetaData(): Promise<ExRinitializeData> {
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
	return { valueData, isOptionActive };
}

export async function createAuOptionMetaData(): Promise<{
	initialValueData: Record<AuOptionId, number>;
	rawData: AuOptionCategoryDto[];
}> {
	const res = await fetch(AU_OPTION_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch Au options: ${res.statusText}`);
	}

	const jsonData = await res.json();
	const data = await AuOptionCategoryDtoArraySchema.parseAsync(jsonData);

	const initialValueData: Record<number, number> = {};
	auOptionMetaData.tabNames = ["0", "1", "2"];
	auOptionMetaData.tabCategoryMap = { 0: [], 1: [], 2: [] };
	auOptionMetaData.categoryMetaData = {};
	auOptionMetaData.options = {};

	let currentTab = 0;

	for (let i = 0; i < data.length; i++) {
		const category = data[i];
		const categoryId = i;
		const firstOption = category.Options[0];
		if (
			currentTab === 0 &&
			firstOption?.TranslatedTitle === "DefaultOption"
		) {
			currentTab = 1;
		} else if (
			currentTab === 1 &&
			firstOption?.TranslatedTitle === "DefaultOption" &&
			firstOption?.TranslatedFormat === "Shapeshifter"
		) {
			currentTab = 2;
		}

		auOptionMetaData.tabCategoryMap[currentTab].push(categoryId);
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: category.TranslatedTitle,
			options: [],
		};

		for (const opt of category.Options) {
			const valueType = opt.Info.ValueType;
			const optionName = opt.Info.OptionName;

			if (valueType === OptionValueType.RoleBase) {
				const roleValue = opt.Value as AuRoleOption;

				// MaxCount
				const maxCountId = getAuOptionId(
					optionName,
					valueType,
					AU_PREFIX.MAX_COUNT,
				);
				auOptionMetaData.categoryMetaData[categoryId].options.push(maxCountId);
				auOptionMetaData.options[maxCountId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range: Array.from({ length: 16 }, (_, i) => i),
				};
				initialValueData[maxCountId] = roleValue.MaxCount;

				// Chance
				const chanceId = getAuOptionId(
					optionName,
					valueType,
					AU_PREFIX.CHANCE,
				);
				auOptionMetaData.categoryMetaData[categoryId].options.push(chanceId);
				auOptionMetaData.options[chanceId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range: Array.from({ length: 11 }, (_, i) => i * 10),
				};
				initialValueData[chanceId] = Math.floor(roleValue.Chance / 10);
			} else {
				const auOptionId = getAuOptionId(optionName, valueType);
				auOptionMetaData.categoryMetaData[categoryId].options.push(auOptionId);

				let range = opt.Range || [];
				let index = 0;

				if (valueType === OptionValueType.Bool) {
					range = [0, 1]; // number[] として扱う
					index = opt.Value ? 1 : 0;
				} else if (range.length > 0) {
					index = range.indexOf(opt.Value as string | number);
					if (index === -1) index = 0;
				}

				auOptionMetaData.options[auOptionId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range: range as (string | number)[],
				};
				initialValueData[auOptionId] = index;
			}
		}
	}

	return {
		initialValueData: initialValueData as unknown as Record<AuOptionId, number>,
		rawData: data,
	};
}

export async function updateExrOption(
	tabId: number,
	categoryId: number,
	optionId: number,
	selection: number,
): Promise<UpdatedOptions | null> {
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

	if (res.status === 202) {
		return null;
	}

	if (!res.ok) {
		throw new Error(`Failed to update ExR option: ${res.statusText}`);
	}

	const jsonData = await res.json();
	return await UpdatedOptionsSchema.parseAsync(jsonData);
}
