import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchSuggestion } from "@/feature/SearchSuggestion";
import { useStore } from "@/useStore";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
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
	it("renders no results when query is empty", () => {
		vi.mocked(useStore).mockReturnValue("");
		render(<SearchSuggestion results={[]} selectedIndex={0} />);
		expect(screen.getByText("Search No Results")).toBeInTheDocument();
	});

	it("renders results", () => {
		vi.mocked(useStore).mockReturnValue("Item");
		const mockResults = Array.from({ length: 5 }, (_, i) => ({
			term: `Item ${i}`,
			info: { mode: "au-cat", tabId: 0, categoryId: i },
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: [],
			},
		}));

		render(<SearchSuggestion results={mockResults} selectedIndex={0} />);
		expect(screen.getAllByRole("button")).toHaveLength(5);
	});

	it("highlights the selected index", () => {
		vi.mocked(useStore).mockReturnValue("Item");
		const mockResults = [
			{
				term: "Item 0",
				info: { mode: "au-cat", tabId: 0, categoryId: 0 },
				parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
			},
			{
				term: "Item 1",
				info: { mode: "au-cat", tabId: 0, categoryId: 1 },
				parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
			},
		];

		const { rerender } = render(
			<SearchSuggestion results={mockResults} selectedIndex={0} />,
		);
		let buttons = screen.getAllByRole("button");
		expect(buttons[0]).toHaveClass("bg-secondary"); // secondary variant uses this class usually

		rerender(<SearchSuggestion results={mockResults} selectedIndex={1} />);
		buttons = screen.getAllByRole("button");
		expect(buttons[1]).toHaveClass("bg-secondary");
	});
});
