import type { StateCreator } from "zustand";

export type SelectedTab = "Au" | "ExR" | "RoleFilter";

/**
 * サイドバーの開閉と表示するタブを選択するスライスのインターフェース
 */
export interface SearchBarSlice {
	optionSearchQuery: string;
	setOptionSearchQuery: (query: string) => void;
	isSuggestOpen: boolean;
	setSuggestOpen: (isOpen: boolean) => void;
	selectedSuggestIndex: number;
	setSelectedSuggestIndex: (index: number) => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
export const createSearchBarSlice: StateCreator<SearchBarSlice> = (set) => {
	return {
		optionSearchQuery: "",
		setOptionSearchQuery: (query: string) => {
			set({ optionSearchQuery: query, selectedSuggestIndex: 0 });
		},
		isSuggestOpen: false,
		setSuggestOpen: (isOpen: boolean) => {
			set({ isSuggestOpen: isOpen });
		},
		selectedSuggestIndex: 0,
		setSelectedSuggestIndex: (index: number) => {
			set({ selectedSuggestIndex: index });
		},
	};
};
