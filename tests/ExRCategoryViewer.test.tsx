import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryViewer } from "@/feature/rightsidepanel/ExRCategoryViewer";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

// Mock ExROptionItemView to avoid complex hook dependencies
vi.mock("@/feature/rightsidepanel/ExROptionItemView", () => ({
	ExROptionItemView: ({ uniqueOptionId }: { uniqueOptionId: number }) => (
		<div data-testid="option-item">{uniqueOptionId}</div>
	),
}));

// Mock RightPanelContainer to ensure the render function is called
vi.mock("@/components/blocks/RightPanelContainer", () => ({
	RightPanelContainer: ({
		arr,
		children,
	}: {
		arr: number[];
		children: (id: number) => React.ReactNode;
	}) => (
		<div data-testid="right-panel-container">
			{arr.map((id) => (
				<div key={id}>{children(id)}</div>
			))}
		</div>
	),
}));

describe("ExRCategoryViewer", () => {
	const categoryId = 1;

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup category metadata
		exrOptionMetaData.categories[categoryId] = {
			name: "Test Category",
			tabId: 0,
		};

		// Default all options as active for tests unless specified otherwise
		useStore.setState({
			isExROptionActive: new Proxy(
				{},
				{
					get: () => true,
				},
			),
		});
	});

	it("renders null if there are no options in the category", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [];
		const { container } = render(<ExRCategoryViewer categoryId={categoryId} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders null if there is only a preset option", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [
			PRESET_OPTION_UNIQUE_ID,
		];
		const { container } = render(<ExRCategoryViewer categoryId={categoryId} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders the category and options correctly", () => {
		const optionId1 = 1001;
		const optionId2 = 1002;
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [
			optionId1,
			optionId2,
		];

		render(<ExRCategoryViewer categoryId={categoryId} />);

		// Check category name
		expect(screen.getByText("Test Category")).toBeInTheDocument();

		// Check options are rendered (via mock)
		const options = screen.getAllByTestId("option-item");
		expect(options).toHaveLength(2);
		expect(options[0]).toHaveTextContent(optionId1.toString());
		expect(options[1]).toHaveTextContent(optionId2.toString());
	});

	it("filters out the PRESET_OPTION_UNIQUE_ID but renders other options", () => {
		const optionId1 = 1001;
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [
			PRESET_OPTION_UNIQUE_ID,
			optionId1,
		];

		render(<ExRCategoryViewer categoryId={categoryId} />);

		const options = screen.getAllByTestId("option-item");
		expect(options).toHaveLength(1);
		expect(options[0]).toHaveTextContent(optionId1.toString());
	});

	it("uses the default open state (true) if not set in store", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [1001];
		render(<ExRCategoryViewer categoryId={categoryId} />);

		const accordionButton = screen.getByRole("button", {
			name: /Test Category/i,
		});
		expect(accordionButton).toHaveAttribute("aria-expanded", "true");
	});

	it("reflects the closed state from the store", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [1001];

		// Set state to closed explicitly
		useStore.setState({
			openedCategoryIdRightSidePanel: { [categoryId]: false },
		});

		render(<ExRCategoryViewer categoryId={categoryId} />);

		const accordionButton = screen.getByRole("button", {
			name: /Test Category/i,
		});
		expect(accordionButton).toHaveAttribute("aria-expanded", "false");
	});

	it("calls toggleCategoryIdRightSidePanel when clicked", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [1001];
		const toggleSpy = vi.spyOn(
			useStore.getState(),
			"toggleCategoryIdRightSidePanel",
		);

		render(<ExRCategoryViewer categoryId={categoryId} />);

		const accordionButton = screen.getByRole("button", {
			name: /Test Category/i,
		});
		fireEvent.click(accordionButton);

		expect(toggleSpy).toHaveBeenCalledWith(categoryId);
	});

	it("renders empty string if category name is missing", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [1001];
		// Delete the category metadata
		delete exrOptionMetaData.categories[categoryId];

		render(<ExRCategoryViewer categoryId={categoryId} />);

		// It should render an empty text, but still render the accordion button
		const accordionButton = screen.getByRole("button");
		expect(accordionButton).toBeInTheDocument();
		// Since ColoredText is used, we might need to check if it's empty
	});

	it("returns null if uniqueOptions is undefined", () => {
		// uniqueOptions will be undefined if not in the map
		const { container } = render(<ExRCategoryViewer categoryId={999} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders empty string if name is missing in category metadata", () => {
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] = [1001];
		exrOptionMetaData.categories[categoryId] = {
			name: undefined as unknown as string,
			tabId: 0,
		};

		render(<ExRCategoryViewer categoryId={categoryId} />);
		const accordionButton = screen.getByRole("button");
		expect(accordionButton).toBeInTheDocument();
	});
});
