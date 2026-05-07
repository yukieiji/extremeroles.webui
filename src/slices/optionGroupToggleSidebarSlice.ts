import { z } from "zod";
import type { StateCreator } from "zustand";
import { loadAppSettingsFromLocalStorage } from "../logics/storageUtils";

export type SelectedTab = "Au" | "ExR" | "RoleFilter";

export const SelectedTabSchema = z.enum(["Au", "ExR", "RoleFilter"]);

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface OptionGroupToggleSidebarSlice {
	isSidebarOpen: boolean;
	selectedTab: SelectedTab;
	isSidebarPending: boolean;
	toggleSidebar: () => void;
	setIsSidebarOpen: (isOpen: boolean) => void;
	setSelectedTab: (tab: SelectedTab) => void;
	setIsSidebarPending: (isPending: boolean) => void;
	resetAll: () => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
export const createOptionGroupToggleSidebarSlice: StateCreator<
	OptionGroupToggleSidebarSlice
> = (set) => {
	const initialSettings = loadAppSettingsFromLocalStorage();

	return {
		isSidebarOpen: true,
		selectedTab: initialSettings.defaultTab,
		isSidebarPending: false,
		toggleSidebar: () => {
			set((state) => {
				return { isSidebarOpen: !state.isSidebarOpen };
			});
		},
		setIsSidebarOpen: (isOpen: boolean) => {
			set({ isSidebarOpen: isOpen });
		},
		setSelectedTab: (tab: SelectedTab) => {
			set({ selectedTab: tab });
		},
		setIsSidebarPending: (isPending: boolean) => {
			set({ isSidebarPending: isPending });
		},
		resetAll: () => {
			const settings = loadAppSettingsFromLocalStorage();
			set({
				selectedTab: settings.defaultTab,
				isSidebarOpen: true,
				isSidebarPending: false,
			});
		},
	};
};
