import type { StateCreator } from 'zustand';

export type SelectedTab = 'ExR' | 'Au';

export interface UISlice {
  isSidebarOpen: boolean;
  selectedTab: SelectedTab;
  toggleSidebar: () => void;
  setSelectedTab: (tab: SelectedTab) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => {
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
