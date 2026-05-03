import type {
	AuOptionId,
	AuOptionMetaDataRecords,
	AuRoleOption,
	ExROptionDto,
	ExROptionMetaDataRecords,
	ExROptionValueData,
	ExRTabMetaData,
	RoleAssignFilterSetDto,
	RoleFilterMetaData,
	TranslationMetaDataRecords,
	UniqueOptionId,
	UpdatedOptions,
	VanillaOptionPutRequest,
} from "../type";
import {
	AU_PREFIX,
	AuOptionCategoryDtoArraySchema,
	ExRTabDtoArraySchema,
	ExRTabId,
	GetTranslationResponseArraySchema,
	OptionValueType,
	RoleAssignFilterDtoSchema,
	UpdatedOptionsSchema,
} from "../type";

import { getAuOptionId, getUniqueOptionId } from "./optionUtils";

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = "/exr/option/";
const AU_OPTION_URL = "/au/option/";
const EXR_ROLE_FILTER_URL = "/exr/role/filter/";
const TRANSLATION_BATCH_URL = "/au/translation/batch/optionunit/";
const TRANSLATION_BATCH_BASE_URL = "/au/translation/batch/";

export const translationMetaData: TranslationMetaDataRecords = {
	booleanTransData: [],
};

export const exrOptionMetaData: ExROptionMetaDataRecords = {
	// ExRTabIdはAPIから取得したデータに基づいて動的に構築され全てあることが保証されるため、初期値は空のオブジェクトで問題ありません
	tabs: {} as Record<ExRTabId, ExRTabMetaData>,
	categories: {},
	options: {},
	globalCategoryIdTopLevelMap: {},
};

export const auOptionMetaData: AuOptionMetaDataRecords = {
	tabNames: [],
	tabCategoryMap: {},
	categoryMetaData: {},
	options: {},
};

export const roleFilterMetaData: RoleFilterMetaData = {
	FilterRoleId: [],
	NormalRoleId: {},
	CombinationId: {},
	GhostRoleId: {},
};

/**
 * ExRオプションのメタデータをリセットする（テスト用）
 */
export function resetExrOptionMetaData() {
	exrOptionMetaData.tabs = {} as Record<ExRTabId, ExRTabMetaData>;
	exrOptionMetaData.categories = {};
	exrOptionMetaData.options = {};
	exrOptionMetaData.globalCategoryIdTopLevelMap = {};
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

/**
 * RoleFilterのメタデータをリセットする（テスト用）
 */
export function resetRoleFilterMetaData() {
	roleFilterMetaData.FilterRoleId = [];
	roleFilterMetaData.NormalRoleId = {};
	roleFilterMetaData.CombinationId = {};
	roleFilterMetaData.GhostRoleId = {};
}

interface ExRinitializeData {
	valueData: Record<UniqueOptionId, ExROptionValueData>;
	isOptionActive: Record<UniqueOptionId, boolean>;
}

export async function fetchTranslationMetaData(): Promise<void> {
	const [resOptionUnit, resBatch] = await Promise.all([
		fetch(TRANSLATION_BATCH_URL),
		fetch(TRANSLATION_BATCH_BASE_URL, {
			method: "POST",
			body: JSON.stringify([{ Key: "optionOff" }, { Key: "optionOn" }]),
		}),
	]);

	if (!resOptionUnit.ok) {
		throw new Error(
			`Failed to fetch translation data (optionunit): ${resOptionUnit.statusText}`,
		);
	}
	if (!resBatch.ok) {
		throw new Error(
			`Failed to fetch translation data (batch): ${resBatch.statusText}`,
		);
	}

	const [jsonOptionUnit, jsonBatch] = await Promise.all([
		resOptionUnit.json(),
		resBatch.json(),
	]);

	const parseOptionUnit =
		await GetTranslationResponseArraySchema.parseAsync(jsonOptionUnit);
	for (const item of parseOptionUnit) {
		translationMetaData[item.Key] = item.Result;
	}

	const parseBatch =
		await GetTranslationResponseArraySchema.parseAsync(jsonBatch);
	const booleanMap: Record<string, string> = {};
	for (const item of parseBatch) {
		booleanMap[item.Key.toString()] = item.Result;
	}
	translationMetaData.booleanTransData = [
		booleanMap.optionOff ?? "",
		booleanMap.optionOn ?? "",
	];
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
		tabId: ExRTabId,
		categoryId: number,
		parentOptionId: number | null,
	) => {
		for (const opt of options) {
			const uniqueId = getUniqueOptionId(tabId, categoryId, opt.Id);

			const format = (translationMetaData[opt.Format] as string) ?? "";

			exrOptionMetaData.options[uniqueId] = {
				metaData: {
					translatedName: opt.TranslatedName,
					format: format,
					type: opt.RangeMeta.Type,
				},
				childOptionIds:
					exrOptionMetaData.options[uniqueId]?.childOptionIds ?? [],
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
				if (!exrOptionMetaData.options[parentUniqueId]) {
					exrOptionMetaData.options[parentUniqueId] = {
						metaData: {
							translatedName: "",
							format: "",
							type: "",
						},
						childOptionIds: [],
					};
				}
				if (
					!exrOptionMetaData.options[parentUniqueId].childOptionIds.includes(
						uniqueId,
					)
				) {
					exrOptionMetaData.options[parentUniqueId].childOptionIds.push(
						uniqueId,
					);
				}
			}

			if (opt.Childs && opt.Childs.length > 0) {
				processOptions(opt.Childs, tabId, categoryId, opt.Id);
			}
		}
	};

	for (const tab of data) {
		exrOptionMetaData.tabs[tab.Id] = {
			name: tab.Name,
			categoryIds: tab.Categories.map((c) => c.Id),
		};
		for (const category of tab.Categories) {
			exrOptionMetaData.categories[category.Id] = {
				name: category.Name,
				tabId: tab.Id,
			};
			if (tab.Id === ExRTabId.GeneralTab) {
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

export async function createAuOptionMetaData(): Promise<
	Record<AuOptionId, number>
> {
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
		if (currentTab === 0 && firstOption?.TranslatedTitle === "DefaultOption") {
			currentTab = 1;
		} else if (
			currentTab === 1 &&
			firstOption?.TranslatedTitle === "DefaultOption" &&
			firstOption?.TranslatedFormat === "ShapeshifterRole"
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

				// Chance
				const chanceId = getAuOptionId(optionName, valueType, AU_PREFIX.CHANCE);
				auOptionMetaData.categoryMetaData[categoryId].options.push(chanceId);
				auOptionMetaData.options[chanceId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range: Array.from({ length: 11 }, (_, i) => i * 10), // 0～100％を10％刻みで用意するため
				};
				initialValueData[chanceId] = Math.floor(roleValue.Chance / 10);

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
					range: Array.from({ length: 16 }, (_, i) => i), // 0～15を1刻みで用意するため
				};
				initialValueData[maxCountId] = roleValue.MaxCount;
			} else {
				const auOptionId = getAuOptionId(optionName, valueType);
				auOptionMetaData.categoryMetaData[categoryId].options.push(auOptionId);

				let range: number[] | string[] | boolean[] = opt.Range || [];
				let index = 0;

				if (valueType === OptionValueType.Bool) {
					range = [false, true];
					index = opt.Value ? 1 : 0;
				} else if (range.length > 0) {
					index = (range as (number | string)[]).indexOf(
						opt.Value as string | number,
					);
					if (index === -1) {
						index = 0;
					}
				}

				auOptionMetaData.options[auOptionId] = {
					title: opt.TranslatedTitle,
					format: opt.TranslatedFormat,
					range,
				};
				initialValueData[auOptionId] = index;
			}
		}
	}

	return initialValueData;
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

export async function fetchRoleFilterData(): Promise<
	Record<string, RoleAssignFilterSetDto>
> {
	const res = await fetch(EXR_ROLE_FILTER_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch role filter data: ${res.statusText}`);
	}

	const jsonData = await res.json();
	const data = await RoleAssignFilterDtoSchema.parseAsync(jsonData);

	roleFilterMetaData.FilterRoleId = data.FilterRoleId;
	roleFilterMetaData.NormalRoleId = data.NormalRoleId;
	roleFilterMetaData.CombinationId = data.CombinationId;
	roleFilterMetaData.GhostRoleId = data.GhostRoleId;

	return data.FilterSet;
}

export async function updateAuOption(
	request: VanillaOptionPutRequest,
): Promise<UpdatedOptions> {
	const res = await fetch(AU_OPTION_URL, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!res.ok) {
		throw new Error(`Failed to update AU option: ${res.statusText}`);
	}

	const jsonData = await res.json();
	return await UpdatedOptionsSchema.parseAsync(jsonData);
}
