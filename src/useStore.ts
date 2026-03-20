import { create } from 'zustand';
import { createOptionGroupToggleSidebarSlice } from './slices/optionGroupToggleSidebarSlice';
import type { OptionGroupToggleSidebarSlice } from './slices/optionGroupToggleSidebarSlice';

/**
 * Zustand ストアの作成
 */
export const useStore = create<OptionGroupToggleSidebarSlice>()((...a) => {
  return {
    ...createOptionGroupToggleSidebarSlice(...a),
  };
});
