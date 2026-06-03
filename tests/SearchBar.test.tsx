import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/feature/SearchBar";
import { globalSearchItems } from "@/logics/api";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";

// Mock the navigation hooks
vi.mock("@/hooks/useOptionNavigation", () => ({
	useExROptionNavigationInline: () => vi.fn(),
	useAuOptionNavigationInline: () => vi.fn(),
}));

describe("SearchBar", () => {
	it("renders correctly with search icon and placeholder", () => {
		render(<SearchBar />);

		const input = screen.getByPlaceholderText(OPTION_SEARCH_PLACEHOLDER);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("type", "search");

		const icon = document.querySelector("svg");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("lucide-search");
	});

	it("shows results when typing and filters by active state for ExR", () => {
		// Setup mock data
		globalSearchItems.push(
			{
				id: "exr-opt-1",
				term: "Active Option",
				info: { mode: "exr-opt", uniqueOptionId: 1 as any },
			},
			{
				id: "exr-opt-2",
				term: "Inactive Option",
				info: { mode: "exr-opt", uniqueOptionId: 2 as any },
			},
			{
				id: "au-opt-3",
				term: "Au Option",
				info: {
					mode: "au-opt",
					tabId: 0,
					categoryId: 0,
					auOptionId: 3 as any,
				},
			},
		);

		// Mock store state
		useStore.setState({
			isExROptionActive: { 1: true, 2: false } as any,
		});

		render(<SearchBar />);

		const input = screen.getByPlaceholderText(OPTION_SEARCH_PLACEHOLDER);

		// Search for "Option"
		fireEvent.change(input, { target: { value: "Option" } });

		// Should show "Active Option" and "Au Option", but not "Inactive Option"
		expect(screen.getByText("Active Option")).toBeInTheDocument();
		expect(screen.getByText("Au Option")).toBeInTheDocument();
		expect(screen.queryByText("Inactive Option")).not.toBeInTheDocument();
	});
});
