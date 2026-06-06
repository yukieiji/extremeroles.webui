import type { StateCreator } from "zustand";
import { globalSearchItems } from "@/logics/api";
import type { SearchItem } from "@/type";

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
	filteredResults: SearchItem[];
	selectNextSuggestion: () => void;
	selectPrevSuggestion: () => void;
}

/**
 * サイドバーの状態管理を行うスライスの生成
 */
import type { ExROptionViewerSlice } from "./exrOptionViewerSlice";

export const createSearchBarSlice: StateCreator<
	SearchBarSlice & ExROptionViewerSlice,
	[],
	[],
	SearchBarSlice
> = (set, get) => {
	return {
		optionSearchQuery: "",
		setOptionSearchQuery: (query: string) => {
			const lowerQuery = query.toLowerCase().trim();
			let filteredResults: SearchItem[] = [];
			if (lowerQuery !== "") {
				const state = get();
				filteredResults = globalSearchItems
					.filter((item) => {
						if (!item.term.toLowerCase().includes(lowerQuery)) {
							return false;
						}
						return item.info.mode === "exr-opt"
							? (state.isExROptionActive[item.info.uniqueOptionId] ?? false)
							: true;
					})
					.slice(0, 10);
			}
			set({
				optionSearchQuery: query,
				selectedSuggestIndex: 0,
				filteredResults,
			});
		},
		isSuggestOpen: false,
		setSuggestOpen: (isOpen: boolean) => {
			set({ isSuggestOpen: isOpen });
		},
		selectedSuggestIndex: 0,
		setSelectedSuggestIndex: (index: number) => {
			set({ selectedSuggestIndex: index });
		},
		filteredResults: [],
		selectNextSuggestion: () => {
			const { filteredResults, selectedSuggestIndex } = get();
			if (filteredResults.length === 0) {
				return;
			}
			set({
				selectedSuggestIndex:
					(selectedSuggestIndex + 1) % filteredResults.length,
			});
		},
		selectPrevSuggestion: () => {
			const { filteredResults, selectedSuggestIndex } = get();
			if (filteredResults.length === 0) {
				return;
			}
			set({
				selectedSuggestIndex:
					(selectedSuggestIndex - 1 + filteredResults.length) %
					filteredResults.length,
			});
		},
	};
};
