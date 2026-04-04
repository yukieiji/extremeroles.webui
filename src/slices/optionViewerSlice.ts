import type { StateCreator } from "zustand";
import { putExrOption } from "../logics/api";
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
	openedExROptionIds: Record<string, boolean>;
	effectiveSelections: Record<string, number>;
	pendingCategoryCounts: Record<number, number>;
	exrOptionsVersion: number;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
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
		openedExROptionIds: {},
		effectiveSelections: {},
		pendingCategoryCounts: {},
		exrOptionsVersion: 0,
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
				pendingCategoryCounts: {},
				exrOptionsVersion: 0,
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
			const [categoryIdStr, optionIdStr] = uniqueOptionId.split("-");
			const categoryId = parseInt(categoryIdStr, 10);
			const optionId = parseInt(optionIdStr, 10);
			const tabId = get().selectedExRTabId;

			// UIを即座に更新するために一時的な選択状態をセット
			set((state) => {
				return {
					effectiveSelections: {
						...state.effectiveSelections,
						[uniqueOptionId]: selection,
					},
					pendingCategoryCounts: {
						...state.pendingCategoryCounts,
						[categoryId]: (state.pendingCategoryCounts[categoryId] || 0) + 1,
					},
				};
			});

			try {
				await putExrOption({
					TabId: tabId,
					CategoryId: categoryId,
					OptionId: optionId,
					Selection: selection,
				});

				// 成功したら一時的な選択状態をクリア（キャッシュから最新が取得されるため）
				set((state) => {
					const newEffectiveSelections = { ...state.effectiveSelections };
					delete newEffectiveSelections[uniqueOptionId];

					return {
						effectiveSelections: newEffectiveSelections,
						exrOptionsVersion: state.exrOptionsVersion + 1,
						pendingCategoryCounts: {
							...state.pendingCategoryCounts,
							[categoryId]: Math.max(
								0,
								(state.pendingCategoryCounts[categoryId] || 1) - 1,
							),
						},
					};
				});
			} catch (error) {
				console.error("Failed to update ExR option selection:", error);
				// エラー時は保留状態を解除し、一時的な選択状態も戻す
				set((state) => {
					const newEffectiveSelections = { ...state.effectiveSelections };
					delete newEffectiveSelections[uniqueOptionId];

					return {
						effectiveSelections: newEffectiveSelections,
						pendingCategoryCounts: {
							...state.pendingCategoryCounts,
							[categoryId]: Math.max(
								0,
								(state.pendingCategoryCounts[categoryId] || 1) - 1,
							),
						},
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
