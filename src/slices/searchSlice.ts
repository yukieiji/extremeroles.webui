import type { StateCreator } from "zustand";

export interface SearchSlice {
	globalSearchQuery: string;
	isGlobalSearchOpen: boolean;
	setGlobalSearchQuery: (query: string) => void;
	setIsGlobalSearchOpen: (isOpen: boolean) => void;
}

export const createSearchSlice: StateCreator<SearchSlice> = (set) => {
	return {
		globalSearchQuery: "",
		isGlobalSearchOpen: false,
		setGlobalSearchQuery: (query: string) => {
			set({ globalSearchQuery: query });
		},
		setIsGlobalSearchOpen: (isOpen: boolean) => {
			set({ isGlobalSearchOpen: isOpen });
		},
	};
};
