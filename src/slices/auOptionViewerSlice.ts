import type { StateCreator } from "zustand";
import type { AuOptionId, UpdateAuArg } from "../type";

/**
 * ExR オプションの状態を管理するスライスのインターフェース
 */
export interface AuOptionViewerSlice {
	selectedAuTabId: AuTab;
	isAuTabPending: boolean;
	openedAuCategoryIds: Record<number, boolean>;
	highlightedAuOptionId: AuOptionId | null;
	auValue: Record<AuOptionId, number>; // セレクション
	setSelectedAuTabId: (id: AuTab) => void;
	setIsAuTabPending: (isPending: boolean) => void;
	setAuValue: (value: Record<AuOptionId, number>) => void;
	setOpenedAuCategoryIds: (ids: Record<number, boolean>) => void;
	setHighlightedAuOptionId: (id: AuOptionId | null) => void;
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
		highlightedAuOptionId: null,
		auValue: {},
		setSelectedAuTabId: (id: AuTab) => {
			set({ selectedAuTabId: id });
		},
		setIsAuTabPending: (isPending: boolean) => {
			set({ isAuTabPending: isPending });
		},
		setAuValue(value) {
			set({ auValue: value });
		},
		setOpenedAuCategoryIds: (ids) => {
			set({ openedAuCategoryIds: ids });
		},
		setHighlightedAuOptionId: (id) => {
			set({ highlightedAuOptionId: id });
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
