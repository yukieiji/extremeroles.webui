import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchSuggestionResult } from "@/feature/SearchSuggestionResult";
import type { AuOptionId, ExRTabId, SearchItem, UniqueOptionId } from "@/type";

const mockNavigateToExR = vi.fn();
const mockNavigateToAu = vi.fn();
const mockSetIsOpen = vi.fn();

// Mock dependencies
vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => mockNavigateToAu,
	useExROptionNavigationInline: () => mockNavigateToExR,
}));

vi.mock("@/useStore", () => ({
	useStore: (
		fn: (state: { setSuggestOpen: (open: boolean) => void }) => void,
	) => fn({ setSuggestOpen: mockSetIsOpen }),
}));

describe("SearchSuggestionResult", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockOnSelect = vi.fn();

	const mockResults: SearchItem[] = [
		{
			term: "ExR Opt",
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: ["P1"],
			},
			info: {
				mode: "exr-opt",
				uniqueOptionId: 1 as unknown as UniqueOptionId,
				parentUniqueOptionIds: [],
			},
		},
		{
			term: "Au Opt",
			parentData: {
				tabName: "Tab",
				categoryName: "Cat",
				parentOptionNames: [],
			},
			info: {
				mode: "au-opt",
				tabId: 0,
				categoryId: 1,
				auOptionId: 100 as unknown as AuOptionId,
			},
		},
		{
			term: "Au Cat",
			parentData: {
				tabName: "Tab",
				categoryName: "",
				parentOptionNames: [],
			},
			info: {
				mode: "au-cat",
				tabId: 0,
				categoryId: 2,
			},
		},
		{
			term: "ExR Cat",
			parentData: {
				tabName: "Tab",
				categoryName: "",
				parentOptionNames: [],
			},
			info: {
				mode: "exr-cat",
				tabId: 0 as ExRTabId,
				categoryId: 3,
			},
		},
	];

	it("renders all result terms", () => {
		render(
			<SearchSuggestionResult
				results={mockResults}
				selectedIndex={0}
				onSelect={mockOnSelect}
			/>,
		);
		expect(screen.getByText("ExR Opt")).toBeInTheDocument();
		expect(screen.getByText("Au Opt")).toBeInTheDocument();
		expect(screen.getByText("Au Cat")).toBeInTheDocument();
		expect(screen.getByText("ExR Cat")).toBeInTheDocument();
	});

	it("calls onSelect on click", () => {
		render(
			<SearchSuggestionResult
				results={mockResults}
				selectedIndex={0}
				onSelect={mockOnSelect}
			/>,
		);
		fireEvent.click(screen.getByText("ExR Opt"));
		expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
	});

	it("applies highlight class to selected index", () => {
		render(
			<SearchSuggestionResult
				results={mockResults}
				selectedIndex={1}
				onSelect={mockOnSelect}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).not.toHaveClass("bg-muted");
		expect(buttons[1]).toHaveClass("bg-muted");
	});

	it("renders icons in SearchParentData", () => {
		const { container } = render(
			<SearchSuggestionResult
				results={[mockResults[0]]}
				selectedIndex={0}
				onSelect={mockOnSelect}
			/>,
		);
		const icons = container.querySelectorAll("svg");
		expect(icons.length).toBeGreaterThanOrEqual(3);
	});
});
