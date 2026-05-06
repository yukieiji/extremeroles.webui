import { beforeEach, describe, expect, it } from "vitest";
import { create } from "zustand";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import type { ExROptionViewerSlice } from "@/slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "@/slices/exrOptionViewerSlice";
import type { UniqueOptionId } from "@/type";

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
		exrOptionMetaData.categories = {
			1: { name: "Category 1", tabId: 0 },
			2: { name: "Category 2", tabId: 0 },
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
		exrOptionMetaData.options = {
			[uId1]: {
				metaData: { translatedName: "Opt 1", format: "", type: "Single" },
				childOptionIds: [],
			},
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
		exrOptionMetaData.categories = { 1: { name: "Cat 1", tabId: 0 } };
		const uId = 101 as UniqueOptionId;
		exrOptionMetaData.options = {
			[uId]: {
				metaData: { translatedName: "Opt 1", format: "", type: "Single" },
				childOptionIds: [],
			},
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
