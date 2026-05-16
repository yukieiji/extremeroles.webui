import type { StateCreator } from "zustand";
import type { BlockDialog } from "../type";

export type SelectedTab = "Au" | "ExR";

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface GlobalUiSlice {
	isPendingBlock: boolean;
	blockCount: number;
	blockDialog: BlockDialog | undefined;
	setPendingBlock: (isBlock: boolean) => void;
	pushBlockCount: () => void;
	popBlockCount: () => void;
	openBlockDialog: (dialog: BlockDialog) => void;
	closeBlockDialog: () => void;
	setRoleSearchQuery: (query: string) => void;
	setSelectedRoleIds: (roleIds: number[]) => void;
	setLastClickedId: (roleId: number | null) => void;
	windowWidth: number;
	setWindowWidth: (width: number) => void;
}

export const createGlobalUiSlice: StateCreator<GlobalUiSlice> = (set, get) => {
	return {
		windowWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
		setWindowWidth: (width) => set({ windowWidth: width }),
		isPendingBlock: false,
		blockCount: 0,
		blockDialog: undefined,
		setPendingBlock: (isBlock: boolean) => {
			set({
				isPendingBlock: isBlock,
			});
		},
		pushBlockCount: () => {
			set({
				blockCount: get().blockCount + 1,
			});
		},
		popBlockCount: () => {
			const next = get().blockCount - 1;
			set({
				blockCount: next >= 0 ? next : 0,
			});
		},
		openBlockDialog(dialog) {
			set({ blockDialog: dialog });
		},
		closeBlockDialog() {
			set({ blockDialog: undefined });
		},
		setRoleSearchQuery: (query: string) => {
			set((state) => {
				const blockDialog = state.blockDialog;
				if (blockDialog?.type === "roleSelect") {
					return {
						blockDialog: {
							...blockDialog,
							searchQuery: query,
						},
					};
				}
				return state;
			});
		},
		setSelectedRoleIds: (roleIds: number[]) => {
			set((state) => {
				const blockDialog = state.blockDialog;
				if (blockDialog?.type === "roleSelect") {
					return {
						blockDialog: {
							...blockDialog,
							selectedRoleIds: roleIds,
						},
					};
				}
				return state;
			});
		},
		setLastClickedId: (roleId: number | null) => {
			set((state) => {
				const blockDialog = state.blockDialog;
				if (blockDialog?.type === "roleSelect") {
					return {
						blockDialog: {
							...blockDialog,
							lastClickedId: roleId,
						},
					};
				}
				return state;
			});
		},
	};
};
