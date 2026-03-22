import type { StateCreator } from 'zustand';
import type { OptionTab } from '../type';
import { loadPresetNamesFromCookie, savePresetNamesToCookie } from '../logics/cookieUtils';

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
  selectedExRTabId: OptionTab;
  isTabPending: boolean;
  openedExRCategoryIds: Record<number, boolean>;
  openedExROptionIds: Record<string, boolean>;
  effectiveSelections: Record<string, number>;
  presetNames: Record<number, string>;
  isPresetDropdownOpen: boolean;
  setSelectedExRTabId: (id: OptionTab) => void;
  setIsTabPending: (isPending: boolean) => void;
  toggleExRCategory: (categoryId: number) => void;
  toggleExROption: (uniqueOptionId: string) => void;
  TEMP_updateExROptionSelection: (uniqueOptionId: string, selection: number) => void;
  updatePresetName: (presetIndex: number, name: string) => void;
  setPresetDropdownOpen: (isOpen: boolean) => void;
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
    presetNames: loadPresetNamesFromCookie(),
    isPresetDropdownOpen: false,
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
        isPresetDropdownOpen: false,
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
    toggleExROption: (uniqueOptionId: string) => {
      set((state) => {
        return {
          openedExROptionIds: {
            ...state.openedExROptionIds,
            [uniqueOptionId]: !state.openedExROptionIds[uniqueOptionId],
          },
        };
      });
    },
    TEMP_updateExROptionSelection: (uniqueOptionId: string, selection: number) => {
      set((state) => {
        return {
          effectiveSelections: {
            ...state.effectiveSelections,
            [uniqueOptionId]: selection,
          },
        };
      });
    },
    updatePresetName: (presetIndex: number, name: string) => {
      set((state) => {
        const newPresetNames = { ...state.presetNames };
        const trimmedName = name.trim();
        if (trimmedName === '') {
          delete newPresetNames[presetIndex];
        } else {
          newPresetNames[presetIndex] = trimmedName;
        }
        savePresetNamesToCookie(newPresetNames);
        return {
          presetNames: newPresetNames,
        };
      });
    },
    setPresetDropdownOpen: (isOpen: boolean) => {
      set({ isPresetDropdownOpen: isOpen });
    },
  };
};
