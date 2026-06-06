import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearchNavigation } from "@/hooks/useSearchNavigation";
import { globalSearchItems } from "@/logics/api";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

// Reset globalSearchItems for testing
(globalSearchItems as SearchItem[]).push(
	{
		term: "Item 1",
		info: { mode: "au-opt", tabId: 0, categoryId: 0, auOptionId: 1 },
		parentData: { tabName: "Tab", categoryName: "Cat", parentOptionNames: [] },
	},
	{
		term: "Item 2",
		info: { mode: "au-opt", tabId: 0, categoryId: 0, auOptionId: 2 },
		parentData: { tabName: "Tab", categoryName: "Cat", parentOptionNames: [] },
	},
);

vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: vi.fn(() => vi.fn()),
	useExROptionNavigationInline: vi.fn(() => vi.fn()),
}));

describe("useSearchNavigation", () => {
	it("initializes with default values", () => {
		const { result } = renderHook(() => useSearchNavigation());
		expect(result.current.selectedSuggestIndex).toBe(0);
	});

	it("handles ArrowDown navigation via store", () => {
		const { result } = renderHook(() => useSearchNavigation());

		act(() => {
			useStore.getState().setOptionSearchQuery("Item");
		});

		act(() => {
			result.current.onKeyDown({
				key: "ArrowDown",
				preventDefault: vi.fn(),
			} as unknown as React.KeyboardEvent<HTMLInputElement>);
		});

		expect(useStore.getState().selectedSuggestIndex).toBe(1);
	});

	it("handles ArrowUp navigation (wrap around) via store", () => {
		const { result } = renderHook(() => useSearchNavigation());

		act(() => {
			useStore.getState().setOptionSearchQuery("Item");
			useStore.getState().setSelectedSuggestIndex(0);
		});

		act(() => {
			result.current.onKeyDown({
				key: "ArrowUp",
				preventDefault: vi.fn(),
			} as unknown as React.KeyboardEvent<HTMLInputElement>);
		});

		expect(useStore.getState().selectedSuggestIndex).toBe(1);
	});

	it("resets selection index when search query changes", () => {
		act(() => {
			useStore.getState().setOptionSearchQuery("Item");
			useStore.getState().setSelectedSuggestIndex(1);
		});

		act(() => {
			useStore.getState().setOptionSearchQuery("new");
		});

		expect(useStore.getState().selectedSuggestIndex).toBe(0);
	});
});
