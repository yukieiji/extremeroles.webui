import type { StateCreator } from 'zustand';
import type { OptionTab } from '../type';

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
  selectedExRTabId: OptionTab;
  openedExRCategoryIds: Record<number, boolean>;
  openedExROptionIds: Record<number, boolean>;
  setSelectedExRTabId: (id: OptionTab) => void;
  toggleExRCategory: (categoryId: number) => void;
  toggleExROption: (optionId: number) => void;
  resetViewer: () => void;
}

/**
 * オプション表示の状態管理を行うスライスの生成
 */
export const createOptionViewerSlice: StateCreator<OptionViewerSlice> = (set) => {
  return {
    selectedExRTabId: 0,
    openedExRCategoryIds: {},
    openedExROptionIds: {},
    setSelectedExRTabId: (id: OptionTab) => {
      set({ selectedExRTabId: id });
    },
    resetViewer: () => {
      set({
        selectedExRTabId: 0,
        openedExRCategoryIds: {},
        openedExROptionIds: {},
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
    toggleExROption: (optionId: number) => {
      set((state) => {
        return {
          openedExROptionIds: {
            ...state.openedExROptionIds,
            [optionId]: !state.openedExROptionIds[optionId],
          },
        };
      });
    },
  };
};
