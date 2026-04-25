import type { StateCreator } from "zustand";

/**
 * 右フローティングパネルの状態管理を行うスライスのインターフェース
 */
export interface RightFloatingPanelSlice {
	isRightPanelOpen: boolean;
	toggleRightPanel: () => void;
	setRightPanelOpen: (isOpen: boolean) => void;
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
	};
};
