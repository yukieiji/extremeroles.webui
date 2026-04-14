import type { StateCreator } from "zustand";
import { updateExrOption } from "../logics/api";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import { getUniqueOptionId, isPresetOption } from "../logics/optionUtils";
import type { OptionTab } from "../type";

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
	selectedExRTabId: OptionTab;
	isTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<string, boolean>;
	pendingExROptionIds: Record<string, boolean>;
	exrVersion: number;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: string) => void;
	updateExROptionSelection: (
		categoryId: number,
		optionId: number,
		selection: number,
	) => Promise<void>;
	updatePresetName: (presetIndex: number, name: string) => void;
	setPresetDropdownOpen: (isOpen: boolean) => void;
	resetViewer: () => void;
}

/**
 * オプション表示の状態管理を行うスライスの生成
 */
export const createOptionViewerSlice: StateCreator<OptionViewerSlice> = (
	set,
	get,
) => {
	return {
		selectedExRTabId: 0,
		isTabPending: false,
		openedExRCategoryIds: {},
		openedExROptionIds: {},
		pendingExROptionIds: {},
		exrVersion: 0,
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
		toggleExROption: (uniqueOptionId: string) => {
			set((state) => {
				return {
					openedExROptionIds: {
						...state.openedExROptionIds,
						[uniqueOptionId]: !state.openedExROptionIds[uniqueOptionId],
					},
				};
			});
		},
		updateExROptionSelection: async (
			categoryId: number,
			optionId: number,
			selection: number,
		) => {
			const uniqueId = getUniqueOptionId(categoryId, optionId);
			const isPreset = isPresetOption(categoryId, optionId);
			const tabId = isPreset ? 0 : get().selectedExRTabId;

			set((state) => {
				return {
					pendingExROptionIds: {
						...state.pendingExROptionIds,
						[uniqueId]: true,
					},
				};
			});

			try {
				await updateExrOption({
					TabId: tabId,
					CategoryId: categoryId,
					OptionId: optionId,
					Selection: selection,
				});
				set((state) => ({ exrVersion: state.exrVersion + 1 }));
			} catch (error) {
				console.error("Failed to update ExR option:", error);
			} finally {
				set((state) => {
					const newPending = { ...state.pendingExROptionIds };
					delete newPending[uniqueId];
					return {
						pendingExROptionIds: newPending,
					};
				});
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
	};
};
