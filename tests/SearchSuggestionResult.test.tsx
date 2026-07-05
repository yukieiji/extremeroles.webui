import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchSuggestionResult } from "@/feature/search/SearchSuggestionResult";
import type { AuOptionId, ExRTabId, SearchItem, UniqueOptionId } from "@/type";

const mockNavigateToExR = vi.fn();
const mockNavigateToAu = vi.fn();
const mockNavigateToExRCat = vi.fn();
const mockNavigateToAuCat = vi.fn();
const mockSetIsOpen = vi.fn();

// Mock dependencies
vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => mockNavigateToAu,
	useExROptionNavigationInline: () => mockNavigateToExR,
	useExRCategoryNavigationInline: () => mockNavigateToExRCat,
	useAuCategoryNavigationInline: () => mockNavigateToAuCat,
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
		render(<SearchSuggestionResult results={mockResults} />);
		expect(screen.getByText("ExR Opt")).toBeInTheDocument();
		expect(screen.getByText("Au Opt")).toBeInTheDocument();
		expect(screen.getByText("Au Cat")).toBeInTheDocument();
		expect(screen.getByText("ExR Cat")).toBeInTheDocument();
	});

	it("calls navigation and closes suggest on click (exr-opt)", () => {
		render(<SearchSuggestionResult results={mockResults} />);
		fireEvent.click(screen.getByText("ExR Opt"));
		expect(mockNavigateToExR).toHaveBeenCalledWith(1);
		expect(mockSetIsOpen).toHaveBeenCalledWith(false);
	});

	it("calls navigation and closes suggest on click (au-opt)", () => {
		render(<SearchSuggestionResult results={mockResults} />);
		fireEvent.click(screen.getByText("Au Opt"));
		expect(mockNavigateToAu).toHaveBeenCalledWith(0, 1, 100);
		expect(mockSetIsOpen).toHaveBeenCalledWith(false);
	});

	it("calls navigation and closes suggest on click (au-cat)", () => {
		render(<SearchSuggestionResult results={mockResults} />);
		fireEvent.click(screen.getByText("Au Cat"));
		expect(mockNavigateToAuCat).toHaveBeenCalledWith(0, 2);
		expect(mockSetIsOpen).toHaveBeenCalledWith(false);
	});

	it("calls navigation and closes suggest on click (exr-cat)", () => {
		render(<SearchSuggestionResult results={mockResults} />);
		fireEvent.click(screen.getByText("ExR Cat"));
		expect(mockNavigateToExRCat).toHaveBeenCalledWith(0, 3);
		expect(mockSetIsOpen).toHaveBeenCalledWith(false);
	});

	it("renders icons in SearchParentData", () => {
		const { container } = render(
			<SearchSuggestionResult results={[mockResults[0]]} />,
		);
		const icons = container.querySelectorAll("svg");
		expect(icons.length).toBeGreaterThanOrEqual(3);
	});
});
