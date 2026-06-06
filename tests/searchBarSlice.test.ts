import { describe, expect, it } from "vitest";
import { create } from "zustand";
import type { SearchBarSlice } from "@/slices/searchBarSlice";
import { createSearchBarSlice } from "@/slices/searchBarSlice";

describe("searchBarSlice", () => {
	const useStore = create<SearchBarSlice>()((...a) => ({
		...createSearchBarSlice(...a),
	}));

	it("should have initial state", () => {
		const state = useStore.getState();
		expect(state.optionSearchQuery).toBe("");
		expect(state.isSuggestOpen).toBe(false);
		expect(state.selectedSuggestIndex).toBe(0);
	});

	it("should set option search query and reset index", () => {
		const { setOptionSearchQuery, setSelectedSuggestIndex } =
			useStore.getState();

		setSelectedSuggestIndex(5);
		expect(useStore.getState().selectedSuggestIndex).toBe(5);

		setOptionSearchQuery("test");
		expect(useStore.getState().optionSearchQuery).toBe("test");
		expect(useStore.getState().selectedSuggestIndex).toBe(0);
	});

	it("should set suggest open and reset index", () => {
		const { setSuggestOpen, setSelectedSuggestIndex } = useStore.getState();

		setSelectedSuggestIndex(3);
		setSuggestOpen(true);
		expect(useStore.getState().isSuggestOpen).toBe(true);
		expect(useStore.getState().selectedSuggestIndex).toBe(0);

		setSelectedSuggestIndex(2);
		setSuggestOpen(false);
		expect(useStore.getState().isSuggestOpen).toBe(false);
		expect(useStore.getState().selectedSuggestIndex).toBe(0);
	});

	it("should set selected suggest index", () => {
		const { setSelectedSuggestIndex } = useStore.getState();

		setSelectedSuggestIndex(10);
		expect(useStore.getState().selectedSuggestIndex).toBe(10);
	});
});
