import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/feature/SearchBar";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";
import { globalSearchItems } from "@/logics/api";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/logics/api", () => ({
	globalSearchItems: [
		{
			term: "Option A",
			info: { mode: "au-opt", tabId: 0, categoryId: 0, auOptionId: 1 },
			parentData: { tabName: "Tab", categoryName: "Cat", parentOptionNames: [] },
		},
		{
			term: "Option B",
			info: { mode: "au-opt", tabId: 0, categoryId: 0, auOptionId: 2 },
			parentData: { tabName: "Tab", categoryName: "Cat", parentOptionNames: [] },
		},
	],
}));

vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => vi.fn(),
	useExROptionNavigationInline: () => vi.fn(),
}));

describe("SearchBar keyboard navigation", () => {
	it("handles ArrowDown and ArrowUp to change selected index", () => {
		const setSelectedSuggestIndex = vi.fn();
		let currentIndex = 0;

		const mockStore = (idx: number) => {
			vi.mocked(useStore).mockImplementation((selector) => {
				const state = {
					optionSearchQuery: "Option",
					setOptionSearchQuery: vi.fn(),
					isSuggestOpen: true,
					setSuggestOpen: vi.fn(),
					selectedSuggestIndex: idx,
					setSelectedSuggestIndex: (newIdx: number) => {
						currentIndex = newIdx;
						setSelectedSuggestIndex(newIdx);
					},
					isExROptionActive: {},
				};
				return selector(state);
			});
		};

		mockStore(0);
		const { rerender } = render(<SearchBar />);
		const input = screen.getByPlaceholderText(OPTION_SEARCH_PLACEHOLDER);

		// Press ArrowDown
		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(setSelectedSuggestIndex).toHaveBeenCalledWith(1);

		// Simulate store update and rerender
		mockStore(1);
		rerender(<SearchBar />);

		// Press ArrowDown again (loops back to 0)
		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(setSelectedSuggestIndex).toHaveBeenCalledWith(0);

		// Simulate store update and rerender
		mockStore(0);
		rerender(<SearchBar />);

		// Press ArrowUp (loops to 1)
		fireEvent.keyDown(input, { key: "ArrowUp" });
		expect(setSelectedSuggestIndex).toHaveBeenCalledWith(1);
	});
});
