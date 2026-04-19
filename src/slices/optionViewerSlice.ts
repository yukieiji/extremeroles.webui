import type { StateCreator } from "zustand";
import { updateExrOption } from "../logics/api";
import { exrOptionMetaData } from "../logics/constants";
import {
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
} from "../logics/cookieUtils";
import { getUniqueOptionId, parseUniqueOptionId } from "../logics/optionUtils";
import type {
	ExRCategoryDto,
	ExROptionDto,
	ExROptionValueData,
	OptionTab,
	UniqueOptionId,
} from "../type";

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
	selectedExRTabId: OptionTab;
	isTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<number, boolean>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	valueData: Record<UniqueOptionId, ExROptionValueData>;
	isOptionActive: Record<UniqueOptionId, boolean>;
	setSelectedExRTabId: (id: OptionTab) => void;
	setIsTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: UniqueOptionId) => void;
	updateExROptionSelection: (
		uniqueOptionId: UniqueOptionId,
		selection: number,
	) => Promise<void>;
	updatePresetName: (presetIndex: number, name: string) => void;
	setPresetDropdownOpen: (isOpen: boolean) => void;
	resetViewer: () => void;
	setExROptions: (
		valueData: Record<UniqueOptionId, ExROptionValueData>,
		optionActiveData: Record<UniqueOptionId, boolean>,
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
			uniqueOptionId: UniqueOptionId,
			selection: number,
		) => {
			const { tabId, categoryId, optionId } =
				parseUniqueOptionId(uniqueOptionId);

			// 楽観的更新: 先にストアを更新して UI の反応を速くする
			set((state) => {
				const current = state.valueData[uniqueOptionId];
				if (current && current.selection === selection) {
					return state;
				}
				return {
					valueData: {
						...state.valueData,
						[uniqueOptionId]: {
							...current,
							selection,
						},
					},
				};
			});

			try {
				const result = await updateExrOption(
					tabId,
					categoryId,
					optionId,
					selection,
				);

				if (!result) {
					return;
				}

				set((state) => {
					let nextValueData = state.valueData;
					let nextIsOptionActive = state.isOptionActive;

					let valueDataChanged = false;
					let isOptionActiveChanged = false;

					const processOption = (
						opt: ExROptionDto,
						catId: number,
						tId: number,
					) => {
						const uId = getUniqueOptionId(tId, catId, opt.Id);

						// values
						const currentValData = nextValueData[uId];
						if (
							!currentValData ||
							currentValData.selection !== opt.Selection ||
							JSON.stringify(currentValData.values) !==
								JSON.stringify(opt.RangeMeta.Values) // 毎回別の配列インスタンスで来る可能性があるため、値の内容で比較する、ただしコストは重めなので今後最適化の余地あり
						) {
							if (!valueDataChanged) {
								nextValueData = { ...nextValueData };
								valueDataChanged = true;
							}
							nextValueData[uId] = {
								selection: opt.Selection,
								values: opt.RangeMeta.Values,
							};
						}

						// isOptionActive
						if (nextIsOptionActive[uId] !== opt.IsActive) {
							if (!isOptionActiveChanged) {
								nextIsOptionActive = { ...nextIsOptionActive };
								isOptionActiveChanged = true;
							}
							nextIsOptionActive[uId] = opt.IsActive;
						}

						if (opt.Childs) {
							for (const child of opt.Childs) {
								processOption(child, catId, tId);
							}
						}
					};

					const processCategory = (cat: ExRCategoryDto) => {
						const tId = exrOptionMetaData.categoryTabMap[cat.Id];
						for (const opt of cat.Options) {
							processOption(opt, cat.Id, tId);
						}
					};

					if (result.UpdatedCategory) {
						processCategory(result.UpdatedCategory);
					}

					for (const chain of result.ChainUpdatedOption) {
						const tId = exrOptionMetaData.categoryTabMap[chain.Id];
						for (const opt of chain.Options) {
							processOption(opt, chain.Id, tId);
						}
					}

					if (!valueDataChanged && !isOptionActiveChanged) {
						return state;
					}

					const patch: Partial<OptionViewerSlice> = {};
					if (valueDataChanged) {
						patch.valueData = nextValueData;
					}
					if (isOptionActiveChanged) {
						patch.isOptionActive = nextIsOptionActive;
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
				valueData,
				isOptionActive: optionActiveData,
			});
		},
	};
};
