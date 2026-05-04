import type { StateCreator } from "zustand";
import { exrOptionMetaData } from "../logics/api";
import { getUpdatedExRState } from "../logics/exrStateLogic";
import {
	loadPresetNamesFromLocalStorage,
	savePresetNamesToLocalStorage,
} from "../logics/storageUtils";
import type {
	ExROptionValueData,
	ExRTabId,
	RoleAssignFilterSetUI,
	UniqueOptionId,
	UpdatedOptions,
} from "../type";

/**
 * ExR オプションの状態を管理するスライスのインターフェース
 */
export interface ExROptionViewerSlice {
	selectedExRTabId: ExRTabId;
	isExRTabPending: boolean;
	openedExRCategoryIds: Record<number, boolean>;
	openedExROptionIds: Record<number, boolean>;
	presetNames: Record<number, string>;
	isPresetDropdownOpen: boolean;
	exrValue: Record<UniqueOptionId, ExROptionValueData>;
	isExROptionActive: Record<UniqueOptionId, boolean>;
	highlightedExROptionId: UniqueOptionId | null;
	roleFilterSet: Record<string, RoleAssignFilterSetUI>;
	setSelectedExRTabId: (id: ExRTabId) => void;
	setIsExRTabPending: (isPending: boolean) => void;
	toggleExRCategory: (categoryId: number) => void;
	toggleExROption: (uniqueOptionId: UniqueOptionId) => void;
	updateExROption: (updateOptions: (UpdatedOptions | null)[]) => void;
	updatePresetName: (presetIndex: number, name: string) => void;
	setPresetDropdownOpen: (isOpen: boolean) => void;
	setHighlightedExROptionId: (id: UniqueOptionId | null) => void;
	resetViewer: () => void;
	setExROptions: (
		valueData: Record<UniqueOptionId, ExROptionValueData>,
		optionActiveData: Record<UniqueOptionId, boolean>,
	) => void;
	setRoleFilterSet: (data: Record<string, RoleAssignFilterSetUI>) => void;
	addRoleFilter: (guid: string) => void;
	deleteRoleFilter: (guid: string) => void;
	addRoleToFilter: (guid: string, roleId: number, roleName: string) => void;
	removeRoleFromFilter: (guid: string, roleId: number) => void;
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
		highlightedExROptionId: null,
		roleFilterSet: {},
		presetNames: loadPresetNamesFromLocalStorage(),
		isPresetDropdownOpen: false,
		setSelectedExRTabId: (id: ExRTabId) => {
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
		setHighlightedExROptionId: (id) => {
			set({ highlightedExROptionId: id });
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
		setRoleFilterSet: (data: Record<string, RoleAssignFilterSetUI>) => {
			set({ roleFilterSet: data });
		},
		addRoleFilter: (guid: string) => {
			set((state) => {
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							AssignNum: 0,
							Roles: [],
						},
					},
				};
			});
		},
		deleteRoleFilter: (guid: string) => {
			set((state) => {
				const nextRoleFilterSet = { ...state.roleFilterSet };
				delete nextRoleFilterSet[guid];
				return {
					roleFilterSet: nextRoleFilterSet,
				};
			});
		},
		addRoleToFilter: (guid: string, roleId: number, roleName: string) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter) {
					return state;
				}
				if (filter.Roles.some((r) => r.id === roleId)) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							Roles: [...filter.Roles, { id: roleId, name: roleName }],
						},
					},
				};
			});
		},
		removeRoleFromFilter: (guid: string, roleId: number) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							Roles: filter.Roles.filter((r) => r.id !== roleId),
						},
					},
				};
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
