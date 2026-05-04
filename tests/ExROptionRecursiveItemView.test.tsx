import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionRecursiveItemView } from "../src/feature/rightsidepanel/ExROptionRecursiveItemView";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { OPEN, CLOSE } from "../src/noTrans";
import type { UniqueOptionId } from "../src/type";
import { useStore } from "../src/useStore";

// Mock child components to isolate ExROptionRecursiveItemView
vi.mock("../src/feature/rightsidepanel/ExROptionItemView", () => ({
	ExROptionItemView: ({ uniqueOptionId }: { uniqueOptionId: UniqueOptionId }) => (
		<div data-testid={`ex-roption-item-${uniqueOptionId}`}>
			Item {uniqueOptionId}
		</div>
	),
}));

vi.mock("../src/feature/rightsidepanel/ExROptionRowView", () => ({
	ExROptionRowView: ({
		uniqueOptionId,
		depth,
		isLeaf,
	}: {
		uniqueOptionId: UniqueOptionId;
		depth: number;
		isLeaf: boolean;
	}) => (
		<div data-testid="ex-roption-row-view">
			Row {uniqueOptionId} Depth {depth} Leaf {String(isLeaf)}
		</div>
	),
}));

describe("ExROptionRecursiveItemView", () => {
	const parentId = getUniqueOptionId(1, 1, 1);
	const childId1 = getUniqueOptionId(1, 1, 2);
	const childId2 = getUniqueOptionId(1, 1, 3);

	beforeEach(() => {
		resetExrOptionMetaData();
		// Manually reset relevant store state
		useStore.setState({
			openedExROptionRightFloatingPanel: {},
		});

		// Setup metadata
		exrOptionMetaData.options[parentId] = {
			metaData: {
				translatedName: "Parent",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [childId1, childId2],
		};
	});

	it("renders ExROptionRowView and handles default depth", () => {
		// @ts-expect-error testing default parameter
		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} />);

		expect(screen.getByTestId("ex-roption-row-view")).toBeInTheDocument();
		expect(screen.getByText(`Row ${parentId} Depth 0 Leaf false`)).toBeInTheDocument();
	});

	it("renders ExROptionRowView with specified depth", () => {
		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} depth={2} />);

		expect(screen.getByText(`Row ${parentId} Depth 2 Leaf false`)).toBeInTheDocument();
	});

	it("shows children when store state is open", () => {
		useStore.setState({
			openedExROptionRightFloatingPanel: { [parentId]: true },
		});

		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} depth={0} />);

		expect(screen.getByTestId(`ex-roption-item-${childId1}`)).toBeInTheDocument();
		expect(screen.getByTestId(`ex-roption-item-${childId2}`)).toBeInTheDocument();
	});

	it("hides children when store state is closed", () => {
		useStore.setState({
			openedExROptionRightFloatingPanel: { [parentId]: false },
		});

		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} depth={0} />);

		expect(screen.queryByTestId(`ex-roption-item-${childId1}`)).not.toBeInTheDocument();
		expect(screen.queryByTestId(`ex-roption-item-${childId2}`)).not.toBeInTheDocument();
	});

	it("toggles the accordion state by calling store action", () => {
		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} depth={0} />);

		const toggleButton = screen.getByRole("button", { name: OPEN });
		fireEvent.click(toggleButton);

		// Check if store state updated
		expect(useStore.getState().openedExROptionRightFloatingPanel[parentId]).toBe(true);

		// Re-render happens via useStore, verify children appear
		expect(screen.getByTestId(`ex-roption-item-${childId1}`)).toBeInTheDocument();

		// Click again to close
		fireEvent.click(screen.getByRole("button", { name: CLOSE }));
		expect(useStore.getState().openedExROptionRightFloatingPanel[parentId]).toBe(false);
		expect(screen.queryByTestId(`ex-roption-item-${childId1}`)).not.toBeInTheDocument();
	});

	it("handles case with no children (empty array)", () => {
		exrOptionMetaData.options[parentId].childOptionIds = [];

		useStore.setState({
			openedExROptionRightFloatingPanel: { [parentId]: true },
		});

		render(<ExROptionRecursiveItemView uniqueOptionId={parentId} depth={0} />);

		expect(screen.getByTestId("ex-roption-row-view")).toBeInTheDocument();
		// RightPanelContainer should handle empty array
		expect(screen.queryByTestId(/ex-roption-item-/)).not.toBeInTheDocument();
	});

	it("handles case where option metadata is missing", () => {
		const unknownId = 999 as UniqueOptionId;

		useStore.setState({
			openedExROptionRightFloatingPanel: { [unknownId]: true },
		});

		render(<ExROptionRecursiveItemView uniqueOptionId={unknownId} depth={0} />);

		expect(screen.getByTestId("ex-roption-row-view")).toBeInTheDocument();
		expect(screen.queryByTestId(/ex-roption-item-/)).not.toBeInTheDocument();
	});
});
