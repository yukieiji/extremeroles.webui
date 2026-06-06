import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchSuggestion } from "@/feature/SearchSuggestion";
import type { SearchItem } from "@/type";

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

describe("SearchSuggestion", () => {
	const mockOnSelect = vi.fn();
	const mockResults: SearchItem[] = [
		{
			term: "Item 0",
			info: { mode: "au-cat", tabId: 0, categoryId: 0 },
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: [],
			},
		},
	];

	it("renders no results when results array is empty", () => {
		render(
			<SearchSuggestion
				results={[]}
				selectedIndex={0}
				onSelect={mockOnSelect}
			/>,
		);
		expect(screen.getByText("Search No Results")).toBeInTheDocument();
	});

	it("renders results when results array is not empty", () => {
		render(
			<SearchSuggestion
				results={mockResults}
				selectedIndex={0}
				onSelect={mockOnSelect}
			/>,
		);
		expect(screen.getByText("Item 0")).toBeInTheDocument();
	});
});
