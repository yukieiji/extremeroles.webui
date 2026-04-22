import type { StateCreator } from "zustand";
import { exrOptionMetaData, updateExrOption } from "../logics/api";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import { parseUniqueOptionId } from "../logics/optionUtils";
import { getUpdatedExRState } from "../logics/exrStateLogic";
import type {
	ExROptionValueData,
	OptionTab,
	UniqueOptionId,
	UpdateExRArg,
} from "../type";

/**
 * ExR オプションの状態を管理するスライスのインターフェース
 */
export interface ExROptionViewerSlice {
	selectedExRTabId: OptionTab;
	isExRTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<number, boolean>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	exrValue: Record<UniqueOptionId, ExROptionValueData>;
	isExROptionActive: Record<UniqueOptionId, boolean>;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsExRTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: UniqueOptionId) => void;
	updateExROptionSelection: (...updateInfos: UpdateExRArg[]) => Promise<void>;
	updatePresetName: (presetIndex: number, name: string) => void;
	setPresetDropdownOpen: (isOpen: boolean) => void;
	resetViewer: () => void;
	setExROptions: (
		valueData: Record<UniqueOptionId, ExROptionValueData>,
		optionActiveData: Record<UniqueOptionId, boolean>,
	) => void;
	validateOpenedIds: () => void;
}

/**
 * ExR オプションの状態管理を行うスライスの生成
 */
export const createExROptionViewerSlice: StateCreator<ExROptionViewerSlice> = (
	set,
) => {
	return {
		selectedExRTabId: 0,
		isExRTabPending: false,
		openedExRCategoryIds: {},
		openedExROptionIds: {},
		exrValue: {},
		isExROptionActive: {},
		presetNames: loadPresetNamesFromCookie(),
		isPresetDropdownOpen: false,
		setSelectedExRTabId: (id: OptionTab) => {
			set({ selectedExRTabId: id });
		},
		setIsExRTabPending: (isPending: boolean) => {
			set({ isExRTabPending: isPending });
		},
		resetViewer: () => {
			set({
				selectedExRTabId: 0,
				isExRTabPending: false,
				openedExRCategoryIds: {},
				openedExROptionIds: {},
				isPresetDropdownOpen: false,
			});
		},
		toggleExRCategory: (categoryId: number) => {
			set((state) => {
				return {
					openedExRCategoryIds: {
						...state.openedExRCategoryIds,
						[categoryId]: !state.openedExRCategoryIds[categoryId],
					},
				};
			});
		},
		toggleExROption: (uniqueOptionId: number) => {
			set((state) => {
				return {
					openedExROptionIds: {
						...state.openedExROptionIds,
						[uniqueOptionId]: !state.openedExROptionIds[uniqueOptionId],
					},
				};
			});
		},
		updateExROptionSelection: async (...updateInfos: UpdateExRArg[]) => {
			try {
				const updateResult = await Promise.all(
					updateInfos.map(async (info) => {
						const { tabId, categoryId, optionId } = parseUniqueOptionId(
							info.uniqueOptionId,
						);
						const result = await updateExrOption(
							tabId,
							categoryId,
							optionId,
							info.selection,
						);
						return result;
					}),
				);

				set((state) => {
					const {
						nextValueData,
						nextIsOptionActive,
						valueDataChanged,
						isOptionActiveChanged,
					} = getUpdatedExRState(
						updateResult,
						state.exrValue,
						state.isExROptionActive,
					);

					if (!valueDataChanged && !isOptionActiveChanged) {
						return state;
					}

					const patch: Partial<ExROptionViewerSlice> = {};
					if (valueDataChanged) {
						patch.exrValue = nextValueData;
					}
					if (isOptionActiveChanged) {
						patch.isExROptionActive = nextIsOptionActive;
					}
					return {
						...state,
						...patch,
					};
				});
			} catch (error) {
				console.error("Error updating ExR option:", error);
			}
		},
		updatePresetName: (presetIndex: number, name: string) => {
			set((state) => {
				const newPresetNames = { ...state.presetNames };
				const trimmedName = name.trim();
				if (trimmedName === "") {
					delete newPresetNames[presetIndex];
				} else {
					newPresetNames[presetIndex] = trimmedName;
				}
				savePresetNamesToCookie(newPresetNames);
				return {
					presetNames: newPresetNames,
				};
			});
		},
		setPresetDropdownOpen: (isOpen: boolean) => {
			set({ isPresetDropdownOpen: isOpen });
		},
		setExROptions: (
			valueData: Record<number, ExROptionValueData>,
			optionActiveData: Record<number, boolean>,
		) => {
			set({
				exrValue: valueData,
				isExROptionActive: optionActiveData,
			});
		},
		validateOpenedIds: () => {
			set((state) => {
				const nextOpenedExRCategoryIds = { ...state.openedExRCategoryIds };
				let categoryChanged = false;
				for (const id in nextOpenedExRCategoryIds) {
					const categoryId = Number(id);
					if (!exrOptionMetaData.categories[categoryId]) {
						delete nextOpenedExRCategoryIds[categoryId];
						categoryChanged = true;
					}
				}

				const nextOpenedExROptionIds = { ...state.openedExROptionIds };
				let optionChanged = false;
				for (const id in nextOpenedExROptionIds) {
					const uniqueOptionId = Number(id) as UniqueOptionId;
					if (!exrOptionMetaData.options[uniqueOptionId]) {
						delete nextOpenedExROptionIds[uniqueOptionId];
						optionChanged = true;
					}
				}

				if (!categoryChanged && !optionChanged) {
					return state;
				}

				return {
					openedExRCategoryIds: nextOpenedExRCategoryIds,
					openedExROptionIds: nextOpenedExROptionIds,
				};
			});
		},
	};
};
