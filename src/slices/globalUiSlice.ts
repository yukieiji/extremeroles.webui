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
	roleSearchQuery: string;
	setPendingBlock: (isBlock: boolean) => void;
	pushBlockCount: () => void;
	popBlockCount: () => void;
	openBlockDialog: (dialog: BlockDialog) => void;
	closeBlockDialog: () => void;
	setRoleSearchQuery: (query: string) => void;
}

export const createGlobalUiSlice: StateCreator<GlobalUiSlice> = (set, get) => {
	return {
		isPendingBlock: false,
		blockCount: 0,
		blockDialog: undefined,
		roleSearchQuery: "",
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
			set({ blockDialog: undefined, roleSearchQuery: "" });
		},
		setRoleSearchQuery: (query: string) => {
			set({ roleSearchQuery: query });
		},
	};
};
