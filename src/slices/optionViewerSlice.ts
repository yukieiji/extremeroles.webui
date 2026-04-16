import type { StateCreator } from "zustand";
import { updateExrOption } from "../logics/api";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import { parseUniqueOptionId } from "../logics/optionUtils";
import type { OptionTab } from "../type";

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
	selectedExRTabId: OptionTab;
	isTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<number, boolean>;
	pendingExROptionIds: Record<number, boolean>;
	pendingExRCategoryIds: Record<number, boolean>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: number) => void;
	updateExROptionSelection: (
		uniqueOptionId: number,
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
		pendingExRCategoryIds: {},
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
				pendingExROptionIds: {},
				pendingExRCategoryIds: {},
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
		updateExROptionSelection: async (
			uniqueOptionId: number,
			selection: number,
		) => {
			const { categoryId, optionId } = parseUniqueOptionId(uniqueOptionId);
			const tabId = get().selectedExRTabId;

			console.log(
				`[Store] Starting update: Option ${optionId} in Category ${categoryId} (Tab ${tabId})`,
			);

			// 更新対象のオプションをペンディング状態にする
			set((state) => {
				return {
					pendingExROptionIds: {
						...state.pendingExROptionIds,
						[uniqueOptionId]: true,
					},
				};
			});

			try {
				const result = await updateExrOption({
					TabId: tabId,
					CategoryId: categoryId,
					OptionId: optionId,
					Selection: selection,
				});

				console.log("[Store] Update successful, clearing pending states");

				// 連鎖更新があったカテゴリも一時的にペンディングにする（UI反映のため）
				if (result.ChainUpdatedOption.length > 0) {
					console.log(
						"[Store] Chain updates detected for categories:",
						result.ChainUpdatedOption.map((c) => c.Id),
					);
					set((state) => {
						const newPendingCategories = { ...state.pendingExRCategoryIds };
						for (const chain of result.ChainUpdatedOption) {
							newPendingCategories[chain.Id] = true;
						}
						return { pendingExRCategoryIds: newPendingCategories };
					});
				}

				// ペンディング状態を解除する
				set((state) => {
					const newPendingOptions = { ...state.pendingExROptionIds };
					delete newPendingOptions[uniqueOptionId];

					const newPendingCategories = { ...state.pendingExRCategoryIds };
					if (result.ChainUpdatedOption.length > 0) {
						for (const chain of result.ChainUpdatedOption) {
							delete newPendingCategories[chain.Id];
						}
					}

					return {
						pendingExROptionIds: newPendingOptions,
						pendingExRCategoryIds: newPendingCategories,
					};
				});
			} catch (error) {
				console.error("[Store] Failed to update ExR option:", error);
				set((state) => {
					const newPendingOptions = { ...state.pendingExROptionIds };
					delete newPendingOptions[uniqueOptionId];
					return { pendingExROptionIds: newPendingOptions };
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
