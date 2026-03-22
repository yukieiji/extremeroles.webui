import type { StateCreator } from 'zustand';
import type { OptionTab } from '../type';

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
  selectedExRTabId: OptionTab;
  isTabPending: boolean;
  openedExRCategoryIds: Record<number, boolean>;
  setSelectedExRTabId: (id: OptionTab) => void;
  setIsTabPending: (isPending: boolean) => void;
  toggleExRCategory: (categoryId: number) => void;
  resetViewer: () => void;
}

/**
 * オプション表示の状態管理を行うスライスの生成
 */
export const createOptionViewerSlice: StateCreator<OptionViewerSlice> = (set) => {
  return {
    selectedExRTabId: 0,
    isTabPending: false,
    openedExRCategoryIds: {},
    setSelectedExRTabId: (id: OptionTab) => {
      set({ selectedExRTabId: id });
    },
    setIsTabPending: (isPending: boolean) => {
      set({ isTabPending: isPending });
    },
    resetViewer: () => {
      set({
        selectedExRTabId: 0,
        isTabPending: false,
        openedExRCategoryIds: {},
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
  };
};
