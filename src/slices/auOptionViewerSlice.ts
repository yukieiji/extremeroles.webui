import type { StateCreator } from "zustand";
import type { AuOptionId, UpdateAuArg } from "../type";

/**
 * ExR オプションの状態を管理するスライスのインターフェース
 */
export interface AuOptionViewerSlice {
	selectedAuTabId: number;
	isAuTabPending: boolean;
	openedAuCategoryIds: Record<number, boolean>;
	auValue: Record<AuOptionId, number>; // セレクション
	setSelectedAuTabId: (id: number) => void;
	setIsAuTabPending: (isPending: boolean) => void;
	setAuValue: (value: Record<AuOptionId, number>) => void;
	toggleAuCategory: (categoryId: number) => void;
	updateAuOptionSelection: (...args: UpdateAuArg[]) => void;
}

/**
 * ExR オプションの状態管理を行うスライスの生成
 */
export const createAuOptionViewerSlice: StateCreator<AuOptionViewerSlice> = (
	set,
) => {
	return {
		selectedAuTabId: 0,
		isAuTabPending: false,
		openedAuCategoryIds: {},
		auValue: {},
		setSelectedAuTabId: (id: number) => {
			set({ selectedAuTabId: id });
		},
		setIsAuTabPending: (isPending: boolean) => {
			set({ isAuTabPending: isPending });
		},
		setAuValue(value) {
			set({ auValue: value });
		},
		toggleAuCategory: (categoryId) => {
			set((state) => {
				const next = { ...state.openedAuCategoryIds };
				next[categoryId] = !next[categoryId];
				return { openedAuCategoryIds: next };
			});
		},
		updateAuOptionSelection: (...args) => {
			set((state) => {
				const nextAuValue = { ...state.auValue };
				for (const arg of args) {
					nextAuValue[arg.auOptionId] = arg.selection;
				}
				return { auValue: nextAuValue };
			});
		},
	};
};
