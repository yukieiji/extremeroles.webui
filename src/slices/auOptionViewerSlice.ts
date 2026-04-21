import type { StateCreator } from "zustand";
import type { AuOptionId } from "../type";

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
	};
};
