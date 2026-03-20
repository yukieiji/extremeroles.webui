import type { StateCreator } from 'zustand';
import type { OptionTab } from '../type';

/**
 * オプション表示エリア（ExR オプションのタブなど）の状態を管理するスライスのインターフェース
 */
export interface OptionViewerSlice {
  selectedExRTabId: OptionTab;
  setSelectedExRTabId: (id: OptionTab) => void;
}

/**
 * オプション表示の状態管理を行うスライスの生成
 */
export const createOptionViewerSlice: StateCreator<OptionViewerSlice> = (set) => {
  return {
    selectedExRTabId: 0,
    setSelectedExRTabId: (id: OptionTab) => {
      set({ selectedExRTabId: id });
    },
  };
};
