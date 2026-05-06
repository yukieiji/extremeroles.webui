import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExROptionRecursiveItem } from "@/feature/exr/ExROptionRecursiveItem";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

describe("ExROptionRecursiveItem", () => {
	const parentUniqueId = getUniqueOptionId(1, 1, 1);
	const childUniqueId = getUniqueOptionId(1, 1, 2);

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup metadata
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
		render(
			<ExROptionRecursiveItem uniqueOptionId={parentUniqueId} depth={0} />,
		);

		// Parent should be visible
		expect(screen.getByText("Parent Option")).toBeInTheDocument();

		// Child should NOT be visible initially (accordion closed)
		expect(screen.queryByText("Child Option")).not.toBeInTheDocument();

		// Click the parent to toggle
		const toggleButton = screen.getByRole("button", { name: "開く" });
		fireEvent.click(toggleButton);

		// Child should be visible now
		expect(screen.getByText("Child Option")).toBeInTheDocument();

		// Click again to close
		fireEvent.click(toggleButton);
		expect(screen.queryByText("Child Option")).not.toBeInTheDocument();
	});

	it("reflects store's opened state", () => {
		// Manually open in store
		useStore.getState().toggleExROption(parentUniqueId);

		render(
			<ExROptionRecursiveItem uniqueOptionId={parentUniqueId} depth={0} />,
		);

		// Child should be visible immediately
		expect(screen.getByText("Child Option")).toBeInTheDocument();
	});
});
