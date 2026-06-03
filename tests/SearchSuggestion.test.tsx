import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Popover } from "@/components/ui/popover";
import { SearchSuggestion } from "@/feature/SearchSuggestion";
import { useStore } from "@/useStore";

// Mock the hooks used in SearchSuggestion
vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => vi.fn(),
	useExROptionNavigationInline: () => vi.fn(),
}));

describe("SearchSuggestion", () => {
	it("renders search results title and query", () => {
		// Set the state for the test
		useStore.setState({ optionSearchQuery: "test query" });

		render(
			<Popover open={true}>
				<SearchSuggestion />
			</Popover>,
		);

		expect(screen.getByText("Search Results")).toBeInTheDocument();
		expect(screen.getByText("test query")).toBeInTheDocument();
	});

	it("renders empty query when optionSearchQuery is empty", () => {
		useStore.setState({ optionSearchQuery: "" });

		render(
			<Popover open={true}>
				<SearchSuggestion />
			</Popover>,
		);

		const queryDisplay = screen.getByTestId("search-query-display");
		expect(queryDisplay).toHaveTextContent("");
	});
});
