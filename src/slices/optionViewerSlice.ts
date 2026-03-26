import type { StateCreator } from "zustand";
import { updateExrOption, updateExrOptionsCache } from "../logics/api";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import type { OptionTab } from "../type";

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
	selectedExRTabId: OptionTab;
	isTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	pendingCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<string, boolean>;
	effectiveSelections: Record<string, number>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
	setCategoryPending: (categoryId: number, isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: string) => void;
	updateExROptionSelection: (
		uniqueOptionId: string,
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
		pendingCategoryIds: {},
		openedExROptionIds: {},
		effectiveSelections: {},
		presetNames: loadPresetNamesFromCookie(),
		isPresetDropdownOpen: false,
		setSelectedExRTabId: (id: OptionTab) => {
			set({ selectedExRTabId: id });
		},
		setIsTabPending: (isPending: boolean) => {
			set({ isTabPending: isPending });
		},
		setCategoryPending: (categoryId: number, isPending: boolean) => {
			set((state) => {
				return {
					pendingCategoryIds: {
						...state.pendingCategoryIds,
						[categoryId]: isPending,
					},
				};
			});
		},
		resetViewer: () => {
			set({
				selectedExRTabId: 0,
				isTabPending: false,
				openedExRCategoryIds: {},
				pendingCategoryIds: {},
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
			uniqueOptionId: string,
			selection: number,
		) => {
			const [catIdStr, optIdStr] = uniqueOptionId.split("-");
			const CategoryId = Number.parseInt(catIdStr, 10);
			const OptionId = Number.parseInt(optIdStr, 10);

			const TabId = get().selectedExRTabId;

			// カテゴリをペンディング状態にする
			get().setCategoryPending(CategoryId, true);

			try {
				const updatedData = await updateExrOption({
					TabId,
					CategoryId,
					OptionId,
					Selection: selection,
				});

				if (updatedData) {
					await updateExrOptionsCache(updatedData);
				}
			} catch (error) {
				console.error("Failed to update ExR option:", error);
			} finally {
				// ペンディング状態を解除
				get().setCategoryPending(CategoryId, false);
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
