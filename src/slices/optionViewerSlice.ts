import type { StateCreator } from "zustand";
import { putExrOption, resetApiCache } from "../logics/api";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import { getUniqueOptionId } from "../logics/optionUtils";
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
			resetApiCache();
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
			const categoryId = Number.parseInt(catIdStr, 10);
			const optionId = Number.parseInt(optIdStr, 10);
			const { selectedExRTabId } = get();

			const result = await putExrOption({
				TabId: selectedExRTabId,
				CategoryId: categoryId,
				OptionId: optionId,
				Selection: selection,
			});

			set((state) => {
				const newSelections = { ...state.effectiveSelections };

				// 更新されたカテゴリ内の全オプションを effectiveSelections に反映
				if (result.UpdatedCategory) {
					const cid = result.UpdatedCategory.Id;
					const traverse = (opts: typeof result.UpdatedCategory.Options) => {
						for (const opt of opts) {
							const uid = getUniqueOptionId(cid, opt.Id);
							newSelections[uid] = opt.Selection;
							if (opt.Childs) {
								traverse(opt.Childs);
							}
						}
					};
					traverse(result.UpdatedCategory.Options);
				}

				// 連鎖的に更新されたオプションも反映
				for (const chain of result.ChainUpdatedOption) {
					const cid = chain.Id;
					const traverseChain = (opts: typeof chain.Options) => {
						for (const opt of opts) {
							const uid = getUniqueOptionId(cid, opt.Id);
							newSelections[uid] = opt.Selection;
							if (opt.Childs) {
								traverseChain(opt.Childs);
							}
						}
					};
					traverseChain(chain.Options);
				}

				return {
					effectiveSelections: newSelections,
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
	};
};
