import { create } from 'zustand';
import { createUISlice } from './slices/uiSlice';
import type { UISlice } from './slices/uiSlice';

export const useStore = create<UISlice>()((...a) => {
  return {
    ...createUISlice(...a),
  };
});
