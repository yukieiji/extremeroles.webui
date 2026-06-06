import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchSuggestion } from "@/feature/SearchSuggestion";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/logics/api", () => ({
	globalSearchItems: Array.from({ length: 15 }, (_, i) => ({
		term: `Item ${i}`,
		info: { mode: "au-cat", tabId: 0, categoryId: i },
		parentData: {
			tabName: "Tab",
			categoryName: "Cat",
			parentOptionNames: [],
		},
	})).concat([
		{
			term: "Active ExR",
			info: { mode: "exr-opt", uniqueOptionId: 100 },
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: [],
			},
		},
		{
			term: "Inactive ExR",
			info: { mode: "exr-opt", uniqueOptionId: 101 },
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: [],
			},
		},
	]),
}));

// Mock Popover components to avoid Context errors
vi.mock("@/components/ui/popover", () => ({
	PopoverHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	PopoverTitle: ({ children }: { children: React.ReactNode }) => (
		<h1>{children}</h1>
	),
}));

type StoreState = {
	optionSearchQuery: string;
	isExROptionActive: Record<number, boolean>;
};

describe("SearchSuggestion", () => {
	it("renders no results when query is empty", () => {
		vi.mocked(useStore).mockImplementation(
			(selector: (state: StoreState) => string | SearchItem[]) =>
				selector({
					optionSearchQuery: "",
					isExROptionActive: {},
				} as StoreState),
		);
		render(<SearchSuggestion />);
		expect(screen.getByText("Search No Results")).toBeInTheDocument();
	});

	it("limits results to 10", () => {
		vi.mocked(useStore).mockImplementation(
			(selector: (state: StoreState) => string | SearchItem[]) =>
				selector({
					optionSearchQuery: "Item",
					isExROptionActive: {},
				} as StoreState),
		);
		render(<SearchSuggestion />);
		expect(screen.getAllByRole("button")).toHaveLength(10);
	});

	it("filters ExR options by active status", () => {
		vi.mocked(useStore).mockImplementation(
			(selector: (state: StoreState) => string | SearchItem[]) =>
				selector({
					optionSearchQuery: "ExR",
					isExROptionActive: { 100: true, 101: false },
				} as StoreState),
		);
		render(<SearchSuggestion />);
		expect(screen.getByText("Active ExR")).toBeInTheDocument();
		expect(screen.queryByText("Inactive ExR")).not.toBeInTheDocument();
	});

	it("handles missing isExROptionActive entry as inactive", () => {
		vi.mocked(useStore).mockImplementation(
			(selector: (state: StoreState) => string | SearchItem[]) =>
				selector({
					optionSearchQuery: "ExR",
					isExROptionActive: {}, // 100 and 101 missing
				} as StoreState),
		);
		render(<SearchSuggestion />);
		expect(screen.queryByText("Active ExR")).not.toBeInTheDocument();
		expect(screen.queryByText("Inactive ExR")).not.toBeInTheDocument();
	});
});
