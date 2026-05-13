import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRGeneralTabOptionViewer } from "@/feature/rightsidepanel/ExRGeneralTabOptionViewer";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import {
	getUniqueOptionId,
	PRESET_OPTION_UNIQUE_ID,
} from "@/logics/optionUtils";
import { ExRTabId } from "@/type";
import { useStore } from "@/useStore";

// Mock child component to focus on ExRGeneralTabOptionViewer logic
vi.mock("@/feature/rightsidepanel/ExRCategoryListViewer", () => ({
	ExRCategoryListViewer: vi.fn(({ categoryIds }: { categoryIds: number[] }) => (
		<div data-testid="category-list-viewer">
			{categoryIds.map((id) => (
				<div key={id} data-testid={`category-${id}`} />
			))}
		</div>
	)),
}));

describe("ExRGeneralTabOptionViewer", () => {
	const TARGET_TAB_ID = ExRTabId.GeneralTab;

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup mock meta data
		exrOptionMetaData.tabs[TARGET_TAB_ID] = {
			name: "General Tab Name",
			categoryIds: [1, 2, 3],
		};

		exrOptionMetaData.categories[1] = { name: "Cat 1", tabId: TARGET_TAB_ID };
		exrOptionMetaData.categories[2] = { name: "Cat 2", tabId: TARGET_TAB_ID };
		exrOptionMetaData.categories[3] = { name: "Cat 3", tabId: TARGET_TAB_ID };

		// Setup top level options for categories
		exrOptionMetaData.globalCategoryIdTopLevelMap[1] = [
			getUniqueOptionId(TARGET_TAB_ID, 1, 101),
		];
		exrOptionMetaData.globalCategoryIdTopLevelMap[2] = [
			getUniqueOptionId(TARGET_TAB_ID, 2, 201),
		];
		exrOptionMetaData.globalCategoryIdTopLevelMap[3] = [
			getUniqueOptionId(TARGET_TAB_ID, 3, 301),
		];

		// Set options as active by default in store
		useStore.getState().setExROptions(
			{},
			{
				[getUniqueOptionId(TARGET_TAB_ID, 1, 101)]: true,
				[getUniqueOptionId(TARGET_TAB_ID, 2, 201)]: true,
				[getUniqueOptionId(TARGET_TAB_ID, 3, 301)]: true,
			},
		);
	});

	it("renders the tab name", () => {
		render(<ExRGeneralTabOptionViewer />);
		expect(screen.getByText("General Tab Name")).toBeInTheDocument();
	});

	it("toggles the accordion when clicked", () => {
		render(<ExRGeneralTabOptionViewer />);
		const button = screen.getByRole("button", { name: /General Tab Name/i });

		// Initial state: isOpen is true by default in store if not set
		expect(button).toHaveAttribute("aria-expanded", "true");

		// Click to close
		fireEvent.click(button);
		expect(useStore.getState().openedExRTabId[TARGET_TAB_ID]).toBe(false);
		// Note: The component re-renders based on store change
		expect(button).toHaveAttribute("aria-expanded", "false");

		// Click to open
		fireEvent.click(button);
		expect(useStore.getState().openedExRTabId[TARGET_TAB_ID]).toBe(true);
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("renders visible categories", () => {
		render(<ExRGeneralTabOptionViewer />);

		expect(screen.getByTestId("category-1")).toBeInTheDocument();
		expect(screen.getByTestId("category-2")).toBeInTheDocument();
		expect(screen.getByTestId("category-3")).toBeInTheDocument();
	});

	it("filters out invisible categories", () => {
		// Set category 2 as inactive
		useStore.getState().setExROptions(
			{},
			{
				[getUniqueOptionId(TARGET_TAB_ID, 1, 101)]: true,
				[getUniqueOptionId(TARGET_TAB_ID, 2, 201)]: false, // Inactive
				[getUniqueOptionId(TARGET_TAB_ID, 3, 301)]: true,
			},
		);

		render(<ExRGeneralTabOptionViewer />);

		expect(screen.getByTestId("category-1")).toBeInTheDocument();
		expect(screen.queryByTestId("category-2")).not.toBeInTheDocument();
		expect(screen.getByTestId("category-3")).toBeInTheDocument();
	});

	it("filters out Preset Option (0,0,0) from category 0 if present", () => {
		// Setup category 0 with preset option and another option
		exrOptionMetaData.tabs[TARGET_TAB_ID].categoryIds = [0, 1];
		exrOptionMetaData.categories[0] = { name: "Cat 0", tabId: TARGET_TAB_ID };

		const presetId = PRESET_OPTION_UNIQUE_ID;
		const otherId = getUniqueOptionId(TARGET_TAB_ID, 0, 999);

		exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [presetId, otherId];

		useStore.getState().setExROptions(
			{},
			{
				[presetId]: true,
				[otherId]: true,
				[getUniqueOptionId(TARGET_TAB_ID, 1, 101)]: true,
			},
		);

		render(<ExRGeneralTabOptionViewer />);

		// Category 0 should be visible because otherId is active
		expect(screen.getByTestId("category-0")).toBeInTheDocument();

		// If only presetId was active, it should be hidden
		act(() => {
			useStore.getState().setExROptions(
				{},
				{
					[presetId]: true,
					[otherId]: false,
					[getUniqueOptionId(TARGET_TAB_ID, 1, 101)]: true,
				},
			);
		});

		expect(screen.queryByTestId("category-0")).not.toBeInTheDocument();
	});

	it("hides category if only preset option is active in category 0", () => {
		exrOptionMetaData.tabs[TARGET_TAB_ID].categoryIds = [0];
		exrOptionMetaData.categories[0] = { name: "Cat 0", tabId: TARGET_TAB_ID };

		const presetId = PRESET_OPTION_UNIQUE_ID;
		exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [presetId];

		useStore.getState().setExROptions(
			{},
			{
				[presetId]: true,
			},
		);

		render(<ExRGeneralTabOptionViewer />);
		expect(screen.queryByTestId("category-0")).not.toBeInTheDocument();
	});

	it("handles missing tab metadata gracefully", () => {
		resetExrOptionMetaData(); // clear everything
		render(<ExRGeneralTabOptionViewer />);
		// Should not crash, and should render empty accordion
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("uses initial open state from store", () => {
		// GeneralTab (0) is true by default in rightSidePanelSlice
		expect(useStore.getState().openedExRTabId[TARGET_TAB_ID]).toBe(true);

		render(<ExRGeneralTabOptionViewer />);
		const button = screen.getByRole("button", { name: /General Tab Name/i });
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("uses fallback true when openedExRTabId is missing in store", () => {
		act(() => {
			useStore.setState({
				openedExRTabId: {} as unknown as Record<ExRTabId, boolean>,
			});
		});
		render(<ExRGeneralTabOptionViewer />);
		const button = screen.getByRole("button", { name: /General Tab Name/i });
		// Fallback ?? true
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("filters out category if globalCategoryIdTopLevelMap is missing for it", () => {
		exrOptionMetaData.tabs[TARGET_TAB_ID].categoryIds = [999];
		// No entry for 999 in globalCategoryIdTopLevelMap

		render(<ExRGeneralTabOptionViewer />);
		expect(screen.queryByTestId("category-999")).not.toBeInTheDocument();
	});
});
