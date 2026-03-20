import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../src/useStore';

describe('SidebarStore', () => {
  beforeEach(() => {
    // ストアを初期状態にリセット
    useStore.setState({
      isSidebarOpen: true,
      selectedTab: 'ExR',
    });
  });

  it('初期状態が正しいこと', () => {
    const state = useStore.getState();
    expect(state.isSidebarOpen).toBe(true);
    expect(state.selectedTab).toBe('ExR');
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
});
