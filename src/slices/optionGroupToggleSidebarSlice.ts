import type { StateCreator } from 'zustand';

import type { OptionTab } from '../type';

export type SelectedTab = 'Au' | 'ExR';

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface OptionGroupToggleSidebarSlice {
  isSidebarOpen: boolean;
  selectedTab: SelectedTab;
  selectedExRTabId: OptionTab;
  toggleSidebar: () => void;
  setSelectedTab: (tab: SelectedTab) => void;
  setSelectedExRTabId: (id: OptionTab) => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
export const createOptionGroupToggleSidebarSlice: StateCreator<OptionGroupToggleSidebarSlice> = (set) => {
  return {
    isSidebarOpen: true,
    selectedTab: 'Au',
    selectedExRTabId: 0,
    toggleSidebar: () => {
      set((state) => {
        return { isSidebarOpen: !state.isSidebarOpen };
      });
    },
    setSelectedTab: (tab: SelectedTab) => {
      set({ selectedTab: tab });
    },
    setSelectedExRTabId: (id: OptionTab) => {
      set({ selectedExRTabId: id });
    },
  };
};
