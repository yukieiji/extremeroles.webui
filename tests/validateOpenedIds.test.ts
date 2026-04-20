import { beforeEach, describe, expect, it } from "vitest";
import { create } from "zustand";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import type { ExROptionViewerSlice } from "../src/slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "../src/slices/exrOptionViewerSlice";
import type { UniqueOptionId } from "../src/type";

describe("validateOpenedIds", () => {
	const useStore = create<ExROptionViewerSlice>()((...a) => ({
		...createExROptionViewerSlice(...a),
	}));

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.setState({
			openedExRCategoryIds: {},
			openedExROptionIds: {},
		});
	});

	it("should remove non-existent category IDs", () => {
		// Mock metadata
		exrOptionMetaData.categoryInfo = {
			1: "Category 1",
			2: "Category 2",
		};

		// Set initial state
		useStore.setState({
			openedExRCategoryIds: {
				1: true,
				3: true, // Non-existent
			},
		});

		const { validateOpenedIds } = useStore.getState();
		validateOpenedIds();

		const state = useStore.getState();
		expect(state.openedExRCategoryIds).toEqual({
			1: true,
		});
	});

	it("should remove non-existent option IDs", () => {
		// Mock metadata
		const uId1 = 101 as UniqueOptionId;
		const uId2 = 102 as UniqueOptionId;
		exrOptionMetaData.optionMetaData = {
			[uId1]: { translatedName: "Opt 1", format: "", type: "Single" },
		};

		// Set initial state
		useStore.setState({
			openedExROptionIds: {
				[uId1]: true,
				[uId2]: true, // Non-existent
			},
		});

		const { validateOpenedIds } = useStore.getState();
		validateOpenedIds();

		const state = useStore.getState();
		expect(state.openedExROptionIds).toEqual({
			[uId1]: true,
		});
	});

	it("should do nothing if all IDs are valid", () => {
		exrOptionMetaData.categoryInfo = { 1: "Cat 1" };
		const uId = 101 as UniqueOptionId;
		exrOptionMetaData.optionMetaData = {
			[uId]: { translatedName: "Opt 1", format: "", type: "Single" },
		};

		const initialState = {
			openedExRCategoryIds: { 1: true },
			openedExROptionIds: { [uId]: true },
		};
		useStore.setState(initialState);

		const { validateOpenedIds } = useStore.getState();
		validateOpenedIds();

		const state = useStore.getState();
		expect(state.openedExRCategoryIds).toEqual(
			initialState.openedExRCategoryIds,
		);
		expect(state.openedExROptionIds).toEqual(initialState.openedExROptionIds);
	});
});
