import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/useStore';

describe('OptionGroupToggleSidebarStore', () => {
  beforeEach(() => {
    // ストアを初期状態にリセット
    useStore.setState({
      isSidebarOpen: true,
      selectedTab: 'ExR',
      selectedExRTabId: 0,
    });
  });

  it('初期状態が正しいこと', () => {
    const state = useStore.getState();
    expect(state.isSidebarOpen).toBe(true);
    expect(state.selectedTab).toBe('ExR');
    expect(state.selectedExRTabId).toBe(0);
  });

  it('toggleSidebar で isSidebarOpen が切り替わること', () => {
    useStore.getState().toggleSidebar();
    expect(useStore.getState().isSidebarOpen).toBe(false);

    useStore.getState().toggleSidebar();
    expect(useStore.getState().isSidebarOpen).toBe(true);
  });

  it('setSelectedTab で selectedTab が変更されること', () => {
    useStore.getState().setSelectedTab('Au');
    expect(useStore.getState().selectedTab).toBe('Au');

    useStore.getState().setSelectedTab('ExR');
    expect(useStore.getState().selectedTab).toBe('ExR');
  });

  it('setSelectedExRTabId で selectedExRTabId が変更されること', () => {
    useStore.getState().setSelectedExRTabId(1);
    expect(useStore.getState().selectedExRTabId).toBe(1);

    useStore.getState().setSelectedExRTabId(2);
    expect(useStore.getState().selectedExRTabId).toBe(2);
  });
});
