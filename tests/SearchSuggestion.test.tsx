import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Popover } from "@/components/ui/popover";
import { SearchSuggestion } from "@/feature/SearchSuggestion";
import {
	auOptionMetaData,
	exrOptionMetaData,
	globalSearchItems,
} from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
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

	it("renders filtered search results with metadata", () => {
		const uniqueId = getUniqueOptionId(1, 1, 1);
		const parentId = getUniqueOptionId(1, 1, 2);

		// Setup mock data
		exrOptionMetaData.categories[1] = { name: "Test Category", tabId: 1 };
		exrOptionMetaData.options[uniqueId] = {
			metaData: { translatedName: "Child Option", format: "", type: "" },
			childOptionIds: [],
			parentOptionIds: [parentId],
		};
		exrOptionMetaData.options[parentId] = {
			metaData: { translatedName: "Parent Option", format: "", type: "" },
			childOptionIds: [uniqueId],
			parentOptionIds: [],
		};

		globalSearchItems.length = 0;
		globalSearchItems.push({
			term: "Child Option",
			info: {
				mode: "exr-opt",
				uniqueOptionId: uniqueId,
				parentUniqueOptionIds: [parentId],
			},
		});

		useStore.setState({
			optionSearchQuery: "Child",
			isExROptionActive: { [uniqueId]: true },
		});

		render(
			<Popover open={true}>
				<SearchSuggestion />
			</Popover>,
		);

		expect(screen.getByText("Child Option")).toBeInTheDocument();
		expect(
			screen.getByText("Test Category > Parent Option"),
		).toBeInTheDocument();
	});

	it("renders au-opt search results with category name", () => {
		const auOptionId = 10001 as any;
		auOptionMetaData.categoryMetaData[10] = {
			name: "Au Category",
			options: [auOptionId],
			tabId: 1,
		};

		globalSearchItems.length = 0;
		globalSearchItems.push({
			term: "Au Option",
			info: {
				mode: "au-opt",
				tabId: 1,
				categoryId: 10,
				auOptionId: auOptionId,
			},
		});

		useStore.setState({ optionSearchQuery: "Au" });

		render(
			<Popover open={true}>
				<SearchSuggestion />
			</Popover>,
		);

		expect(screen.getByText("Au Option")).toBeInTheDocument();
		expect(screen.getByText("Au Category")).toBeInTheDocument();
	});
});
