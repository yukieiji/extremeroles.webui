import type { StateCreator } from 'zustand';
import type { OptionTab } from '../type';

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
  selectedExRTabId: OptionTab;
  isTabPending: boolean;
  openedExRCategoryIds: Record<number, boolean>;
  openedExROptionIds: Record<number, boolean>;
  effectiveSelections: Record<number, number>;
  setSelectedExRTabId: (id: OptionTab) => void;
  setIsTabPending: (isPending: boolean) => void;
  toggleExRCategory: (categoryId: number) => void;
  toggleExROption: (optionId: number) => void;
  TEMP_updateExROptionSelection: (optionId: number, selection: number) => void;
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
    openedExROptionIds: {},
    effectiveSelections: {},
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
        openedExROptionIds: {},
        effectiveSelections: {},
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
    TEMP_updateExROptionSelection: (optionId: number, selection: number) => {
      set((state) => {
        return {
          effectiveSelections: {
            ...state.effectiveSelections,
            [optionId]: selection,
          },
        };
      });
    },
  };
};
