import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchSuggestionResult } from "@/feature/SearchSuggestionResult";
import type { SearchItem } from "@/type";

// Mock dependencies
vi.mock("@/hooks/useOptionNavigation", () => ({
	useAuOptionNavigationInline: () => vi.fn(),
	useExROptionNavigationInline: () => vi.fn(),
}));

vi.mock("@/useStore", () => ({
	useStore: (fn: any) => fn({ setSuggestOpen: vi.fn() }),
}));

describe("SearchSuggestionResult", () => {
	const mockResults: SearchItem[] = [
		{
			term: "Test Option",
			parentData: {
				tabName: "General",
				categoryName: "Category 1",
				parentOptionNames: ["Parent 1"],
			},
			info: {
				mode: "exr-opt",
				uniqueOptionId: 1 as any,
				parentUniqueOptionIds: [],
			},
		},
	];

	it("renders term and parent data", () => {
		render(<SearchSuggestionResult results={mockResults} />);

		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("General")).toBeInTheDocument();
		expect(screen.getByText("Category 1")).toBeInTheDocument();
		expect(screen.getByText("Parent 1")).toBeInTheDocument();
	});

    it("renders icons in SearchParentData", () => {
        const { container } = render(<SearchSuggestionResult results={mockResults} />);

        // CornerDownRight and ChevronRight icons should be present
        const icons = container.querySelectorAll("svg");
        expect(icons.length).toBeGreaterThanOrEqual(3); // 1 for CornerDownRight, 2 for ChevronRight
    });
});
