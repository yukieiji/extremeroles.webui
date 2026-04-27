import type { StateCreator } from "zustand";

/**
 * 右フローティングパネルの状態管理を行うスライスのインターフェース
 */
export interface RightFloatingPanelSlice {
	isRightPanelOpen: boolean;
	toggleRightPanel: () => void;
	setRightPanelOpen: (isOpen: boolean) => void;
	isSettingsOpen: boolean;
	toggleSettings: () => void;
	isAuSettingsOpen: boolean;
	toggleAuSettings: () => void;
	isExrSettingsOpen: boolean;
	toggleExrSettings: () => void;
	openedAuTab0CategoryIds: Record<number, boolean>;
	setOpenedAuTab0CategoryIds: (ids: Record<number, boolean>) => void;
	toggleAuTab0Category: (categoryId: number) => void;
}

/**
 * 右フローティングパネルの状態管理を行うスライスの生成
 */
export const createRightFloatingPanelSlice: StateCreator<
	RightFloatingPanelSlice
> = (set) => {
	return {
		isRightPanelOpen: false, // デフォルトクローズ
		toggleRightPanel: () => {
			set((state) => {
				return { isRightPanelOpen: !state.isRightPanelOpen };
			});
		},
		setRightPanelOpen: (isOpen: boolean) => {
			set({ isRightPanelOpen: isOpen });
		},
		isSettingsOpen: true,
		toggleSettings: () => {
			set((state) => {
				return { isSettingsOpen: !state.isSettingsOpen };
			});
		},
		isAuSettingsOpen: true,
		toggleAuSettings: () => {
			set((state) => {
				return { isAuSettingsOpen: !state.isAuSettingsOpen };
			});
		},
		isExrSettingsOpen: true,
		toggleExrSettings: () => {
			set((state) => {
				return { isExrSettingsOpen: !state.isExrSettingsOpen };
			});
		},
		openedAuTab0CategoryIds: {},
		setOpenedAuTab0CategoryIds: (ids) => {
			set({ openedAuTab0CategoryIds: ids });
		},
		toggleAuTab0Category: (categoryId) => {
			set((state) => {
				const next = { ...state.openedAuTab0CategoryIds };
				const current = next[categoryId] ?? true;
				next[categoryId] = !current;
				return { openedAuTab0CategoryIds: next };
			});
		},
	};
};
