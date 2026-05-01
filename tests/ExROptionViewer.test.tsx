import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExROptionViewer } from "../src/feature/rightsidepanel/ExROptionViewer";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId, PRESET_OPTION_UNIQUE_ID } from "../src/logics/optionUtils";
import { ExRTabId } from "../src/type";
import { useStore } from "../src/useStore";

// Mock the navigation hook
vi.mock("../src/hooks/useExRNavigation", () => ({
	useExRNavigation: () => ({
		navigateToExROption: vi.fn(),
	}),
}));

describe("ExROptionViewer Component", () => {
	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup Preset Option (OptionId 0, CategoryId 0, TabId 0)
		const presetUniqueId = PRESET_OPTION_UNIQUE_ID;
		exrOptionMetaData.options[presetUniqueId] = {
			metaData: {
				translatedName: "Preset",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};

		// Setup General Tab
		exrOptionMetaData.tabs[ExRTabId.GeneralTab] = {
			name: "General",
			categoryIds: [1, 2],
		};

		// Category 1: Active
		exrOptionMetaData.categories[1] = { name: "Active Cat", tabId: ExRTabId.GeneralTab };
		const opt1 = getUniqueOptionId(ExRTabId.GeneralTab, 1, 101);
		exrOptionMetaData.globalCategoryIdTopLevelMap[1] = [opt1];
		exrOptionMetaData.options[opt1] = {
			metaData: { translatedName: "Opt 1", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		// Category 2: Inactive
		exrOptionMetaData.categories[2] = { name: "Inactive Cat", tabId: ExRTabId.GeneralTab };
		const opt2 = getUniqueOptionId(ExRTabId.GeneralTab, 2, 102);
		exrOptionMetaData.globalCategoryIdTopLevelMap[2] = [opt2];
		exrOptionMetaData.options[opt2] = {
			metaData: { translatedName: "Opt 2", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[presetUniqueId]: { selection: 0, values: ["Default"] },
				[opt1]: { selection: 0, values: [123] },
				[opt2]: { selection: 0, values: [456] },
			},
			{
				[presetUniqueId]: true,
				[opt1]: true,
				[opt2]: false,
			},
		);
	});

	it("renders preset and active categories from General Tab", () => {
		render(<ExROptionViewer />);

		// Should render Preset
		expect(screen.getByText("Preset")).toBeInTheDocument();
		expect(screen.getByText("Default")).toBeInTheDocument();

		// Should render Active Category
		expect(screen.getByText("Active Cat")).toBeInTheDocument();

		// Should NOT render Inactive Category
		expect(screen.queryByText("Inactive Cat")).not.toBeInTheDocument();
	});

	it("renders options within active category when opened", () => {
		// Open the category
		useStore.getState().toggleExRCategory(1);

		render(<ExROptionViewer />);

		// Should render Option 1
		expect(screen.getByText("Opt 1")).toBeInTheDocument();
		expect(screen.getByText("123")).toBeInTheDocument();
	});
});
