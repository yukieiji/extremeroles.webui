import type { StateCreator } from "zustand";
import type { OptionTab } from "../type";

/**
 * 右フローティングパネルの状態管理を行うスライスのインターフェース
 */
export interface RightFloatingPanelSlice {
	isRightPanelOpen: boolean;
	toggleRightPanel: () => void;
	setRightPanelOpen: (isOpen: boolean) => void;
	isSettingsOpen: boolean;
	toggleSettings: () => void;
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
	openedExRRoleTabIds: Record<OptionTab, boolean>;
	toggleExRRoleTab: (tabId: OptionTab) => void;
}

/**
 * 右フローティングパネルの状態管理を行うスライスの生成
 */
export const createRightFloatingPanelSlice: StateCreator<
	RightFloatingPanelSlice
> = (set) => {
	return {
		isRightPanelOpen: false, // デフォルトクローズ
		toggleRightPanel: () => {
			set((state) => {
				return { isRightPanelOpen: !state.isRightPanelOpen };
			});
		},
		setRightPanelOpen: (isOpen: boolean) => {
			set({ isRightPanelOpen: isOpen });
		},
		isSettingsOpen: true,
		toggleSettings: () => {
			set((state) => {
				return { isSettingsOpen: !state.isSettingsOpen };
			});
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
		openedExRRoleTabIds: {
			0: true,
			1: true,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true,
			7: true,
		},
		toggleExRRoleTab: (tabId) => {
			set((state) => {
				const next = { ...state.openedExRRoleTabIds };
				next[tabId] = !next[tabId];
				return { openedExRRoleTabIds: next };
			});
		},
	};
};
