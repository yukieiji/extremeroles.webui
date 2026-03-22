import type { StateCreator } from 'zustand';

export type SelectedTab = 'Au' | 'ExR';

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface OptionGroupToggleSidebarSlice {
  isSidebarOpen: boolean;
  selectedTab: SelectedTab;
  toggleSidebar: () => void;
  setSelectedTab: (tab: SelectedTab) => void;
  resetAll: () => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
export const createOptionGroupToggleSidebarSlice: StateCreator<OptionGroupToggleSidebarSlice> = (set) => {
  return {
    isSidebarOpen: true,
    selectedTab: 'Au',
    toggleSidebar: () => {
      set((state) => {
        return { isSidebarOpen: !state.isSidebarOpen };
      });
    },
    setSelectedTab: (tab: SelectedTab) => {
      set({ selectedTab: tab });
    },
    resetAll: () => {
      set({ selectedTab: 'Au', isSidebarOpen: true });
    },
  };
};
