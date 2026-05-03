import type { StateCreator } from "zustand";

export type SelectedTab = "Au" | "ExR" | "RoleFilter";

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
	return {
		isSidebarOpen: true,
		selectedTab: "Au",
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
			set({ selectedTab: "Au", isSidebarOpen: true, isSidebarPending: false });
		},
	};
};
