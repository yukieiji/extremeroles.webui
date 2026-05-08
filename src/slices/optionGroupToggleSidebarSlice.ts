import type { StateCreator } from "zustand";

export type SelectedTab = "Au" | "ExR" | "RoleFilter";

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface OptionGroupToggleSidebarSlice {
	selectedTab: SelectedTab;
	isSidebarPending: boolean;
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
	return {
		selectedTab: "Au",
		isSidebarPending: false,
		setSelectedTab: (tab: SelectedTab) => {
			set({ selectedTab: tab });
		},
		setIsSidebarPending: (isPending: boolean) => {
			set({ isSidebarPending: isPending });
		},
		resetAll: () => {
			set({ selectedTab: "Au", isSidebarPending: false });
		},
	};
};
