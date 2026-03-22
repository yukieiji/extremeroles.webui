import { describe, it, expect } from 'vitest';
import { createOptionViewerSlice } from '../src/slices/optionViewerSlice';
import { create } from 'zustand';
import type { OptionViewerSlice } from '../src/slices/optionViewerSlice';

describe('optionViewerSlice', () => {
  const useStore = create<OptionViewerSlice>()((...a) => ({
    ...createOptionViewerSlice(...a),
  }));

  it('should have initial state', () => {
    const state = useStore.getState();
    expect(state.selectedExRTabId).toBe(0);
    expect(state.openedExRCategoryIds).toEqual({});
  });

  it('should toggle category open state', () => {
    const { toggleExRCategory } = useStore.getState();

    toggleExRCategory(1);
    expect(useStore.getState().openedExRCategoryIds[1]).toBe(true);

    toggleExRCategory(1);
    expect(useStore.getState().openedExRCategoryIds[1]).toBe(false);

    toggleExRCategory(2);
    expect(useStore.getState().openedExRCategoryIds[2]).toBe(true);
    expect(useStore.getState().openedExRCategoryIds[1]).toBe(false);
  });

  it('should set selected tab id', () => {
    const { setSelectedExRTabId } = useStore.getState();

    setSelectedExRTabId(2);
    expect(useStore.getState().selectedExRTabId).toBe(2);
  });


});
