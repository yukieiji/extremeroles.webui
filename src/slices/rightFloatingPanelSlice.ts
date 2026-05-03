import type { StateCreator } from "zustand";
import type { ExRTabId, UniqueOptionId } from "../type";

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
	isAuCrewmateRolesOpen: boolean;
	toggleAuCrewmateRoles: () => void;
	isAuImpostorRolesOpen: boolean;
	toggleAuImpostorRoles: () => void;
	rightPanelWidth: number;
	setRightPanelWidth: (width: number) => void;
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
	openedExRTabId: Record<ExRTabId, boolean>;
	toggleExRTabId: (tabId: ExRTabId) => void;
	openedCategoryIdRightFloatingPanel: Record<number, boolean>;
	toggleCategoryIdRightFloatingPanel: (categoryId: number) => void;
	openedExROptionRightFloatingPanel: Record<UniqueOptionId, boolean>;
	toggleExROptionRightFloatingPanel: (optionId: UniqueOptionId) => void;
	shouldRenderRightPanelContent: boolean;
	setShouldRenderRightPanelContent: (shouldRender: boolean) => void;
}

/**
 * 右フローティングパネルの状態管理を行うスライスの生成
 */
export const createRightFloatingPanelSlice: StateCreator<
	RightFloatingPanelSlice
> = (set) => {
	const savedWidth = localStorage.getItem("rightPanelWidth");
	const initialWidth = savedWidth ? Number.parseInt(savedWidth, 10) : 320;

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
		isAuCrewmateRolesOpen: true,
		toggleAuCrewmateRoles: () => {
			set((state) => ({ isAuCrewmateRolesOpen: !state.isAuCrewmateRolesOpen }));
		},
		isAuImpostorRolesOpen: true,
		toggleAuImpostorRoles: () => {
			set((state) => ({ isAuImpostorRolesOpen: !state.isAuImpostorRolesOpen }));
		},
		rightPanelWidth: initialWidth,
		setRightPanelWidth: (width) => {
			set({ rightPanelWidth: width });
		},
		isResizing: false,
		setIsResizing: (isResizing) => {
			set({ isResizing });
		},
		openedExRTabId: {
			0: true,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false,
			7: false,
		},
		toggleExRTabId: (tabId) => {
			set((state) => {
				return {
					openedExRTabId: {
						...state.openedExRTabId,
						[tabId]: !state.openedExRTabId[tabId],
					},
				};
			});
		},
		openedCategoryIdRightFloatingPanel: {},
		toggleCategoryIdRightFloatingPanel: (categoryId) => {
			set((state) => {
				return {
					openedCategoryIdRightFloatingPanel: {
						...state.openedCategoryIdRightFloatingPanel,
						[categoryId]: !state.openedCategoryIdRightFloatingPanel[categoryId],
					},
				};
			});
		},
		openedExROptionRightFloatingPanel: {},
		toggleExROptionRightFloatingPanel: (optionId) => {
			set((state) => {
				return {
					openedExROptionRightFloatingPanel: {
						...state.openedExROptionRightFloatingPanel,
						[optionId]: !state.openedExROptionRightFloatingPanel[optionId],
					},
				};
			});
		},
		shouldRenderRightPanelContent: false,
		setShouldRenderRightPanelContent: (shouldRender) => {
			set({ shouldRenderRightPanelContent: shouldRender });
		},
	};
};
