import type { StateCreator } from 'zustand';

export type SelectedTab = 'ExR' | 'Au';

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface OptionGroupToggleSidebarSlice {
  isSidebarOpen: boolean;
  selectedTab: SelectedTab;
  toggleSidebar: () => void;
  setSelectedTab: (tab: SelectedTab) => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
export const createOptionGroupToggleSidebarSlice: StateCreator<OptionGroupToggleSidebarSlice> = (set) => {
  return {
    isSidebarOpen: true,
    selectedTab: 'ExR',
    toggleSidebar: () => {
      set((state) => {
        return { isSidebarOpen: !state.isSidebarOpen };
      });
    },
    setSelectedTab: (tab: SelectedTab) => {
      set({ selectedTab: tab });
    },
  };
};
