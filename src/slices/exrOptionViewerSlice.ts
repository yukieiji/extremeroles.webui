import type { StateCreator } from "zustand";
import { exrOptionMetaData } from "../logics/api";
import { getUpdatedExRState } from "../logics/exrStateLogic";
import {
	loadPresetNamesFromLocalStorage,
	savePresetNamesToLocalStorage,
} from "../logics/storageUtils";
import type {
	ExROptionValueData,
	OptionTab,
	UniqueOptionId,
	UpdatedOptions,
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
	updateExROption: (updateOptions: (UpdatedOptions | null)[]) => void;
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
		presetNames: loadPresetNamesFromLocalStorage(),
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
		updateExROption: (updateOptions: (UpdatedOptions | null)[]) => {
			set((state) => {
				const {
					nextValueData,
					nextIsOptionActive,
					valueDataChanged,
					isOptionActiveChanged,
				} = getUpdatedExRState(
					updateOptions,
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
				savePresetNamesToLocalStorage(newPresetNames);
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
