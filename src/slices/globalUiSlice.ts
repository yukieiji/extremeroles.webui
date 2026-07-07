import type { StateCreator } from "zustand";
import {
	type AppSetting,
	loadAppSetting,
	saveAppSetting,
} from "../logics/storageUtils";
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
	updateSelectedRoleIds: (...roleIds: number[]) => void;
	setLastClickedId: (roleId: number | null) => void;
	windowWidth: number;
	setWindowWidth: (width: number) => void;
	appSetting: AppSetting;
	updateAppSetting: (setting: Partial<AppSetting>) => void;
	mockPlayerInput: string;
	setMockPlayerInput: (input: string) => void;
}

export const createGlobalUiSlice: StateCreator<GlobalUiSlice> = (set, get) => {
	return {
		appSetting: loadAppSetting(),
		updateAppSetting: (setting) => {
			const nextSetting = { ...get().appSetting, ...setting };
			saveAppSetting(nextSetting);
			set({ appSetting: nextSetting });
		},
		mockPlayerInput: "",
		setMockPlayerInput: (input) => set({ mockPlayerInput: input }),
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
		updateSelectedRoleIds: (...roleIds) => {
			set((state) => {
				const blockDialog = state.blockDialog;
				if (blockDialog?.type === "roleSelect") {
					let nextIds: number[];
					if (roleIds.length === 1) {
						// Toggle single ID
						const roleId = roleIds[0];
						const isSelected = blockDialog.selectedRoleIds.includes(roleId);
						nextIds = isSelected
							? blockDialog.selectedRoleIds.filter((id) => id !== roleId)
							: [...blockDialog.selectedRoleIds, roleId];
					} else {
						// Merge multiple IDs
						const nextSet = new Set([
							...blockDialog.selectedRoleIds,
							...roleIds,
						]);
						nextIds = Array.from(nextSet);
					}
					return {
						blockDialog: {
							...blockDialog,
							selectedRoleIds: nextIds,
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
