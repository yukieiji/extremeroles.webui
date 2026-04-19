import {
	type ExROptionDto,
	type ExROptionMetaDataRecords,
	type ExROptionValueData,
	type ExRTabDto,
	OptionTab,
} from "../type";
import { getUniqueOptionId } from "./optionUtils";

export const exrOptionMetaData: ExROptionMetaDataRecords = {
	tabInfo: {} as Record<OptionTab, string>,
	tabIdMap: {} as Record<OptionTab, number[]>,
	categoryTabMap: {} as Record<number, OptionTab>,
	categoryInfo: {},
	globalCategoryIdTopLevelMap: {},
	optionMetaData: {},
	childOptionMap: {},
};

export let exrInitialValueData: Record<number, ExROptionValueData> = {};
export let exrInitialOptionActive: Record<number, boolean> = {};

export function resetExrOptionMetaData() {
	exrOptionMetaData.tabInfo = {} as Record<OptionTab, string>;
	exrOptionMetaData.tabIdMap = {} as Record<OptionTab, number[]>;
	exrOptionMetaData.categoryTabMap = {} as Record<number, OptionTab>;
	exrOptionMetaData.categoryInfo = {};
	exrOptionMetaData.globalCategoryIdTopLevelMap = {};
	exrOptionMetaData.optionMetaData = {};
	exrOptionMetaData.childOptionMap = {};
	exrInitialValueData = {};
	exrInitialOptionActive = {};
}

export function processExRTabData(data: ExRTabDto[]) {
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
				exrOptionMetaData.globalCategoryIdTopLevelMap[category.Id] =
					category.Options.map((o) =>
						getUniqueOptionId(tab.Id, category.Id, o.Id),
					);
			}
			processOptions(category.Options, tab.Id, category.Id, null);
		}
	}

	exrInitialValueData = valueData;
	exrInitialOptionActive = isOptionActive;
}
