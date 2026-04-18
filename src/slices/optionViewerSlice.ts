import type { StateCreator } from "zustand";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import type { ExROptionValueData, OptionTab } from "../type";

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
	selectedExRTabId: OptionTab;
	isTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<number, boolean>;
	effectiveSelections: Record<number, number>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	valueData: Record<number, ExROptionValueData>;
	isOptionActive: Record<number, boolean>;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: number) => void;
	TEMP_updateExROptionSelection: (
		uniqueOptionId: number,
		selection: number,
	) => void;
	updatePresetName: (presetIndex: number, name: string) => void;
	setPresetDropdownOpen: (isOpen: boolean) => void;
	resetViewer: () => void;
	setExROptions: (
		valueData: Record<number, ExROptionValueData>,
		optionActiveData: Record<number, boolean>,
	) => void;
}

/**
 * オプション表示の状態管理を行うスライスの生成
 */
export const createOptionViewerSlice: StateCreator<OptionViewerSlice> = (
	set,
) => {
	return {
		selectedExRTabId: 0,
		isTabPending: false,
		openedExRCategoryIds: {},
		openedExROptionIds: {},
		effectiveSelections: {},
		valueData: {},
		isOptionActive: {},
		presetNames: loadPresetNamesFromCookie(),
		isPresetDropdownOpen: false,
		setSelectedExRTabId: (id: OptionTab) => {
			set({ selectedExRTabId: id });
		},
		setIsTabPending: (isPending: boolean) => {
			set({ isTabPending: isPending });
		},
		resetViewer: () => {
			set({
				selectedExRTabId: 0,
				isTabPending: false,
				openedExRCategoryIds: {},
				openedExROptionIds: {},
				effectiveSelections: {},
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
		TEMP_updateExROptionSelection: (
			uniqueOptionId: number,
			selection: number,
		) => {
			set((state) => {
				return {
					effectiveSelections: {
						...state.effectiveSelections,
						[uniqueOptionId]: selection,
					},
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
				valueData,
				isOptionActive: optionActiveData,
			});
		},
	};
};
