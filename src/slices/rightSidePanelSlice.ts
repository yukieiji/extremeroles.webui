import type { StateCreator } from "zustand";
import {
	loadRightPanelWidth,
	loadRightSidebarState,
	saveRightPanelWidth,
	saveRightSidebarState,
} from "../logics/storageUtils";
import type { ExRTabId, UniqueOptionId } from "../type";

/**
 * 右サイドパネルの状態管理を行うスライスのインターフェース
 */
export interface RightSidePanelSlice {
	isRightPanelOpen: boolean;
	toggleRightPanel: () => void;
	setRightPanelOpen: (isOpen: boolean) => void;
	isAuSettingsOpen: boolean;
	toggleAuSettings: () => void;
	isExrSettingsOpen: boolean;
	toggleExrSettings: () => void;
	openedAuTab0CategoryIds: Record<number, boolean>;
	setOpenedAuTab0CategoryIds: (ids: Record<number, boolean>) => void;
	toggleAuTab0Category: (categoryId: number) => void;
	isAuCrewmateRolesOpen: boolean;
	toggleAuCrewmateRoles: () => void;
	isAuImpostorRolesOpen: boolean;
	toggleAuImpostorRoles: () => void;
	rightPanelWidth: number;
	setRightPanelWidth: (width: number) => void;
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
	openedExRTabId: Record<ExRTabId, boolean>;
	toggleExRTabId: (tabId: ExRTabId) => void;
	openedCategoryIdRightSidePanel: Record<number, boolean>;
	toggleCategoryIdRightSidePanel: (categoryId: number) => void;
	openedExROptionRightSidePanel: Record<UniqueOptionId, boolean>;
	toggleExROptionRightSidePanel: (optionId: UniqueOptionId) => void;
}

/**
 * 右サイドパネルの状態管理を行うスライスの生成
 */
export const createRightSidePanelSlice: StateCreator<RightSidePanelSlice> = (
	set,
) => {
	const initialWidth = loadRightPanelWidth(320);
	const initialOpen = loadRightSidebarState(false);

	return {
		isRightPanelOpen: initialOpen,
		toggleRightPanel: () => {
			set((state) => {
				const nextOpen = !state.isRightPanelOpen;
				saveRightSidebarState(nextOpen);
				return { isRightPanelOpen: nextOpen };
			});
		},
		setRightPanelOpen: (isOpen: boolean) => {
			saveRightSidebarState(isOpen);
			set({ isRightPanelOpen: isOpen });
		},
		isAuSettingsOpen: true,
		toggleAuSettings: () => {
			set((state) => {
				return { isAuSettingsOpen: !state.isAuSettingsOpen };
			});
		},
		isExrSettingsOpen: true,
		toggleExrSettings: () => {
			set((state) => {
				return { isExrSettingsOpen: !state.isExrSettingsOpen };
			});
		},
		openedAuTab0CategoryIds: {},
		setOpenedAuTab0CategoryIds: (ids) => {
			set({ openedAuTab0CategoryIds: ids });
		},
		toggleAuTab0Category: (categoryId) => {
			set((state) => {
				const next = { ...state.openedAuTab0CategoryIds };
				next[categoryId] = !next[categoryId];
				return { openedAuTab0CategoryIds: next };
			});
		},
		isAuCrewmateRolesOpen: true,
		toggleAuCrewmateRoles: () => {
			set((state) => ({ isAuCrewmateRolesOpen: !state.isAuCrewmateRolesOpen }));
		},
		isAuImpostorRolesOpen: true,
		toggleAuImpostorRoles: () => {
			set((state) => ({ isAuImpostorRolesOpen: !state.isAuImpostorRolesOpen }));
		},
		rightPanelWidth: initialWidth,
		setRightPanelWidth: (width) => {
			saveRightPanelWidth(width);
			set({ rightPanelWidth: width });
		},
		isResizing: false,
		setIsResizing: (isResizing) => {
			set({ isResizing });
		},
		openedExRTabId: {
			0: true,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false,
			7: false,
		},
		toggleExRTabId: (tabId) => {
			set((state) => {
				return {
					openedExRTabId: {
						...state.openedExRTabId,
						[tabId]: !state.openedExRTabId[tabId],
					},
				};
			});
		},
		openedCategoryIdRightSidePanel: {},
		toggleCategoryIdRightSidePanel: (categoryId) => {
			set((state) => {
				return {
					openedCategoryIdRightSidePanel: {
						...state.openedCategoryIdRightSidePanel,
						[categoryId]: !state.openedCategoryIdRightSidePanel[categoryId],
					},
				};
			});
		},
		openedExROptionRightSidePanel: {},
		toggleExROptionRightSidePanel: (optionId) => {
			set((state) => {
				return {
					openedExROptionRightSidePanel: {
						...state.openedExROptionRightSidePanel,
						[optionId]: !state.openedExROptionRightSidePanel[optionId],
					},
				};
			});
		},
	};
};
