import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExROptionItem } from "@/feature/exr/ExROptionItem";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

describe("ExROptionItem (Recursive Behavior)", () => {
	const parentUniqueId = getUniqueOptionId(1, 1, 1);
	const childUniqueId = getUniqueOptionId(1, 1, 2);

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup metadata
		exrOptionMetaData.categories[1] = {
			tabId: 1,
			translatedName: "Category 1",
		};
		exrOptionMetaData.options[parentUniqueId] = {
			metaData: {
				translatedName: "Parent Option",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [childUniqueId],
		};
		exrOptionMetaData.options[childUniqueId] = {
			metaData: {
				translatedName: "Child Option",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};

		// Setup store state
		useStore.getState().setExROptions(
			{
				[parentUniqueId]: { selection: 1, values: [0, 1] },
				[childUniqueId]: { selection: 0, values: [0, 1] },
			},
			{
				[parentUniqueId]: true,
				[childUniqueId]: true,
			},
		);
	});

	it("renders parent option and toggles child options", () => {
		render(<ExROptionItem uniqueOptionId={parentUniqueId} depth={0} />);

		// Parent should be visible
		expect(screen.getByText("Parent Option")).toBeInTheDocument();

		// Click the parent to toggle
		const toggleButton = screen.getByRole("button", { name: "開く" });
		fireEvent.click(toggleButton);

		// Child should be visible now
		expect(screen.getByText("Child Option")).toBeInTheDocument();

		// Click again to close
		fireEvent.click(toggleButton);
	});

	it("reflects store's opened state", () => {
		// Manually open in store
		useStore.getState().openExROptions([parentUniqueId]);

		render(<ExROptionItem uniqueOptionId={parentUniqueId} depth={0} />);

		// Child should be visible immediately
		expect(screen.getByText("Child Option")).toBeInTheDocument();
	});

	it("automatically opens when child becomes active", () => {
		// Initially child is inactive
		useStore.getState().setExROptions(
			{
				[parentUniqueId]: { selection: 1, values: [0, 1] },
				[childUniqueId]: { selection: 0, values: [0, 1] },
			},
			{
				[parentUniqueId]: true,
				[childUniqueId]: false,
			},
		);

		const { rerender } = render(
			<ExROptionItem uniqueOptionId={parentUniqueId} depth={0} />,
		);

		// Not an accordion yet (no children active)
		expect(
			screen.queryByRole("button", { name: "開く" }),
		).not.toBeInTheDocument();

		// Make child active via updateExROption
		useStore.getState().updateExROption([
			{
				UpdatedCategory: null,
				ChainUpdatedOption: [
					{
						Id: 1,
						Options: [
							{
								Id: 2,
								IsActive: true,
								Selection: 0,
								RangeMeta: { Values: [0, 1] },
								Childs: [],
							},
						],
					},
				],
			},
		]);

		rerender(<ExROptionItem uniqueOptionId={parentUniqueId} depth={0} />);

		// Should now be an accordion and automatically opened
		expect(screen.getByRole("button", { name: "閉じる" })).toBeInTheDocument();
		expect(screen.getByText("Child Option")).toBeInTheDocument();
	});
});
