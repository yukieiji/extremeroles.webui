import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionRecursiveItem } from "@/feature/exr/ExROptionRecursiveItem";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

// Mock Child components if necessary, but here we want to test with real metadata
// Setup mock for useActiveChildOptions if needed, but it uses exrOptionMetaData
describe("ExROptionRecursiveItem", () => {
	const tabId = 1;
	const categoryId = 1;
	const parentOptionId = 1;
	const childOptionId = 2;
	const parentUniqueId = getUniqueOptionId(tabId, categoryId, parentOptionId);
	const childUniqueId = getUniqueOptionId(tabId, categoryId, childOptionId);

	beforeEach(() => {
		resetExrOptionMetaData();
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
				type: "Boolean",
			},
			childOptionIds: [],
		};
		useStore.setState({
			openedExROptionIds: {},
			isExROptionActive: {
				[parentUniqueId]: true,
				[childUniqueId]: true,
			},
			exrValue: {
				[parentUniqueId]: { selection: 1, values: [0, 1, 2] },
				[childUniqueId]: { selection: 0, values: [0, 1] },
			},
		});
	});

	it("renders parent option and toggles child options", async () => {
		render(
			<ExROptionRecursiveItem
				uniqueOptionId={parentUniqueId}
				depth={0}
			/>,
		);

		expect(screen.getByText("Parent Option")).toBeInTheDocument();

		// Initially child is not visible
		expect(screen.queryByText("Child Option")).not.toBeInTheDocument();

		// Click the parent to toggle
		const toggleButton = screen
			.getAllByRole("button")
			.find((btn) => btn.querySelector(".lucide-chevron-right"))!;
		await act(async () => {
			fireEvent.click(toggleButton);
		});

		// Now child should be visible
		expect(screen.getByText("Child Option")).toBeInTheDocument();

		// Click again to close
		await act(async () => {
			fireEvent.click(toggleButton);
		});

		// Child should be hidden again
		expect(screen.queryByText("Child Option")).not.toBeInTheDocument();
	});

	it("reflects store's opened state", async () => {
		// Set store state to opened
		act(() => {
			useStore.setState({
				openedExROptionIds: { [parentUniqueId]: true },
			});
		});

		render(
			<ExROptionRecursiveItem
				uniqueOptionId={parentUniqueId}
				depth={0}
			/>,
		);

		// Child should be visible initially because of store state
		expect(screen.getByText("Child Option")).toBeInTheDocument();
	});
});
