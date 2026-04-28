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
	openedExrGeneralCategoryIds: Record<number, boolean>;
	setOpenedExrGeneralCategoryIds: (ids: Record<number, boolean>) => void;
	toggleExrGeneralCategory: (categoryId: number) => void;
	isAuTabOpen: Record<number, boolean>;
	toggleAuTab: (tabId: number) => void;
	isExrTabOpen: Record<number, boolean>;
	toggleExrTab: (tabId: number) => void;
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
				next[categoryId] = !next[categoryId];
				return { openedAuTab0CategoryIds: next };
			});
		},
		openedExrGeneralCategoryIds: {},
		setOpenedExrGeneralCategoryIds: (ids) => {
			set({ openedExrGeneralCategoryIds: ids });
		},
		toggleExrGeneralCategory: (categoryId) => {
			set((state) => {
				const next = { ...state.openedExrGeneralCategoryIds };
				next[categoryId] = !next[categoryId];
				return { openedExrGeneralCategoryIds: next };
			});
		},
		isAuTabOpen: { 1: true, 2: true },
		toggleAuTab: (tabId) => {
			set((state) => {
				const next = { ...state.isAuTabOpen };
				next[tabId] = !next[tabId];
				return { isAuTabOpen: next };
			});
		},
		isExrTabOpen: {
			1: true,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true,
			7: true,
		},
		toggleExrTab: (tabId) => {
			set((state) => {
				const next = { ...state.isExrTabOpen };
				next[tabId] = !next[tabId];
				return { isExrTabOpen: next };
			});
		},
	};
};
