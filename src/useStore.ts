import { create } from 'zustand';
import { createOptionGroupToggleSidebarSlice } from './slices/optionGroupToggleSidebarSlice';
import type { OptionGroupToggleSidebarSlice } from './slices/optionGroupToggleSidebarSlice';
import { createOptionViewerSlice } from './slices/optionViewerSlice';
import type { OptionViewerSlice } from './slices/optionViewerSlice';

/**
 * Zustand ストアの作成
 */
export const useStore = create<OptionGroupToggleSidebarSlice & OptionViewerSlice>()((...a) => {
  return {
    ...createOptionGroupToggleSidebarSlice(...a),
    ...createOptionViewerSlice(...a),
  };
});
