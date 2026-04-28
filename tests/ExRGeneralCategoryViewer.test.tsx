import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExRGeneralCategoryViewer } from "../src/feature/rightsidepanel/ExRGeneralCategoryViewer";
import { exrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { OptionTab } from "../src/type";
import { useStore } from "../src/useStore";

vi.mock("../src/hooks/useExRNavigation", () => ({
	useExRNavigation: () => ({
		navigateToExROption: vi.fn(),
	}),
}));

describe("ExRGeneralCategoryViewer", () => {
	it("renders correctly with active options", () => {
		const categoryId = 100;
		const optionId = 200;
		const uniqueId = getUniqueOptionId(
			OptionTab.GeneralTab,
			categoryId,
			optionId,
		);

		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: OptionTab.GeneralTab,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [uniqueId];
		exrOptionMetaData.options[uniqueId] = {
			metaData: {
				translatedName: "Test Option",
				format: "EmptyFormat",
				type: "Int32",
			},
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[uniqueId]: { selection: 0, values: [10, 20] },
			},
			{ [uniqueId]: true },
		);

		render(<ExRGeneralCategoryViewer categoryId={categoryId} />);

		expect(screen.getByText("Test Category")).toBeInTheDocument();
		expect(screen.getByText("Test Option")).toBeInTheDocument();
		expect(screen.getByText("10")).toBeInTheDocument();
	});

	it("returns null if no active options", () => {
		const categoryId = 101;
		const optionId = 201;
		const uniqueId = getUniqueOptionId(
			OptionTab.GeneralTab,
			categoryId,
			optionId,
		);

		exrOptionMetaData.categories[categoryId] = {
			name: "Inactive Category",
			tabId: OptionTab.GeneralTab,
		};
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [uniqueId];

		useStore.getState().setExROptions({}, { [uniqueId]: false });

		const { container } = render(
			<ExRGeneralCategoryViewer categoryId={categoryId} />,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
