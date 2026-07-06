import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/feature/search/SearchBar";
import { translationMetaData } from "@/logics/api";
import { useStore } from "@/useStore";

// Mock Popover to test onOpenChange
vi.mock("@/components/ui/popover", () => ({
	Popover: ({
		children,
		onOpenChange,
		open,
	}: {
		children: React.ReactNode;
		onOpenChange: (open: boolean, details: unknown) => void;
		open: boolean;
	}) => (
		<div data-testid="popover-mock" data-open={open}>
			<button
				type="button"
				onClick={() => onOpenChange(true, {})}
				data-testid="trigger-open"
			>
				Open
			</button>
			<button
				type="button"
				onClick={() => onOpenChange(false, { reason: "outside-press" })}
				data-testid="trigger-close-outside"
			>
				Close Outside
			</button>
			{children}
		</div>
	),
	PopoverTrigger: ({ render }: { render: React.ReactNode }) => (
		<div>{render}</div>
	),
	PopoverContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	PopoverHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	PopoverTitle: ({ children }: { children: React.ReactNode }) => (
		<h1>{children}</h1>
	),
}));

const mockNavigateToExR = vi.fn();
const mockNavigateToAu = vi.fn();
const mockNavigateToExRCat = vi.fn();
const mockNavigateToAuCat = vi.fn();

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => mockNavigateToAu,
	useExROptionNavigationInline: () => mockNavigateToExR,
	useExRCategoryNavigationInline: () => mockNavigateToExRCat,
	useAuCategoryNavigationInline: () => mockNavigateToAuCat,
}));

vi.mock("@/hooks/useSearchResults", () => ({
	useSearchResults: () => [
		{
			term: "Result 1",
			info: { mode: "exr-opt", uniqueOptionId: 1 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		{
			term: "Result 2",
			info: { mode: "au-opt", tabId: 0, categoryId: 1, auOptionId: 100 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
	],
}));

describe("SearchBar", () => {
	it("renders correctly with search icon and placeholder", () => {
		vi.mocked(useStore).mockReturnValue("");
		render(<SearchBar />);

		const input = screen.getByPlaceholderText(
			translationMetaData.OPTION_SEARCH_PLACEHOLDER,
		);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("type", "search");

		const icon = document.querySelector("svg");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("lucide-search");
	});

	it("handles keyboard navigation (ArrowDown, ArrowUp, Enter)", () => {
		const setSelectedSuggestIndex = vi.fn();
		const setSuggestOpen = vi.fn();

		vi.mocked(useStore).mockImplementation((selector) => {
			const state = {
				selectedTab: "Au",
				optionSearchQuery: "test",
				isSuggestOpen: true,
				selectedSuggestIndex: 0,
				setSelectedSuggestIndex,
				setSuggestOpen,
			};
			return (selector as (state: unknown) => unknown)(state);
		});

		render(<SearchBar />);
		const input = screen.getByPlaceholderText(
			translationMetaData.OPTION_SEARCH_PLACEHOLDER,
		);

		// ArrowDown
		fireEvent.keyDown(input, { key: "ArrowDown" });
		expect(setSelectedSuggestIndex).toHaveBeenCalledWith(1);

		// ArrowUp (from 0 with 2 results should loop to 1)
		fireEvent.keyDown(input, { key: "ArrowUp" });
		expect(setSelectedSuggestIndex).toHaveBeenCalledWith(1);

		// Enter (select first result - exr-opt)
		fireEvent.keyDown(input, { key: "Enter" });
		expect(mockNavigateToExR).toHaveBeenCalledWith(1);
		expect(setSuggestOpen).toHaveBeenCalledWith(false);
	});

	it("handles Enter key for au-opt", () => {
		const setSelectedSuggestIndex = vi.fn();
		const setSuggestOpen = vi.fn();

		vi.mocked(useStore).mockImplementation((selector) => {
			const state = {
				selectedTab: "Au",
				optionSearchQuery: "test",
				isSuggestOpen: true,
				selectedSuggestIndex: 1, // Second result is au-opt
				setSelectedSuggestIndex,
				setSuggestOpen,
			};
			return (selector as (state: unknown) => unknown)(state);
		});

		render(<SearchBar />);
		const input = screen.getByPlaceholderText(
			translationMetaData.OPTION_SEARCH_PLACEHOLDER,
		);

		fireEvent.keyDown(input, { key: "Enter" });
		expect(mockNavigateToAu).toHaveBeenCalledWith(0, 1, 100);
		expect(setSuggestOpen).toHaveBeenCalledWith(false);
	});

	it("handles other input events", () => {
		const setOptionSearchQuery = vi.fn();
		const setSuggestOpen = vi.fn();

		vi.mocked(useStore).mockImplementation((selector) => {
			const state = {
				selectedTab: "Au",
				optionSearchQuery: "",
				isSuggestOpen: false,
				selectedSuggestIndex: 0,
				setOptionSearchQuery,
				setSuggestOpen,
			};
			return (selector as (state: unknown) => unknown)(state);
		});

		render(<SearchBar />);
		const input = screen.getByPlaceholderText(
			translationMetaData.OPTION_SEARCH_PLACEHOLDER,
		);

		// Focus
		fireEvent.focus(input);
		expect(setSuggestOpen).toHaveBeenCalledWith(true);

		// Change
		fireEvent.change(input, { target: { value: "new query" } });
		expect(setOptionSearchQuery).toHaveBeenCalledWith("new query");

		// Click (stopPropagation)
		fireEvent.click(input);
	});

	it("handles Popover onOpenChange", () => {
		const setSuggestOpen = vi.fn();

		vi.mocked(useStore).mockImplementation((selector) => {
			const state = {
				selectedTab: "Au",
				optionSearchQuery: "",
				isSuggestOpen: true,
				setSuggestOpen,
			};
			return (selector as (state: unknown) => unknown)(state);
		});

		render(<SearchBar />);

		fireEvent.click(screen.getByTestId("trigger-open"));
		expect(setSuggestOpen).toHaveBeenCalledWith(true);

		fireEvent.click(screen.getByTestId("trigger-close-outside"));
		expect(setSuggestOpen).toHaveBeenCalledWith(false);
	});
});
