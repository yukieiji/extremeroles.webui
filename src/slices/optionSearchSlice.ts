import type { StateCreator } from "zustand";
import type { SearchItem } from "../type";

export interface OptionSearchSlice {
	optionSearchQuery: string;
	setOptionSearchQuery: (query: string) => void;
	filteredOptionSearchItems: SearchItem[];
	setFilteredOptionSearchItems: (items: SearchItem[]) => void;
	globalSearchItems: SearchItem[];
	setGlobalSearchItems: (items: SearchItem[]) => void;
}

export const createOptionSearchSlice: StateCreator<OptionSearchSlice> = (
	set,
) => {
	return {
		optionSearchQuery: "",
		setOptionSearchQuery: (query) => set({ optionSearchQuery: query }),
		filteredOptionSearchItems: [],
		setFilteredOptionSearchItems: (items) =>
			set({ filteredOptionSearchItems: items }),
		globalSearchItems: [],
		setGlobalSearchItems: (items) => set({ globalSearchItems: items }),
	};
};
