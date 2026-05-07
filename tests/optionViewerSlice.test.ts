import { describe, expect, it } from "vitest";
import { create } from "zustand";
import type { ExROptionViewerSlice } from "@/slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "@/slices/exrOptionViewerSlice";
import type { UniqueOptionId } from "@/type";

describe("optionViewerSlice", () => {
	const useStore = create<ExROptionViewerSlice>()((...a) => ({
		...createExROptionViewerSlice(...a),
	}));

	it("should have initial state", () => {
		const state = useStore.getState();
		expect(state.selectedExRTabId).toBe(0);
		expect(state.isExRTabPending).toBe(false);
		expect(state.openedExRCategoryIds).toEqual({});
	});

	it("should toggle category open state", () => {
		const { toggleExRCategory } = useStore.getState();

		toggleExRCategory(1);
		expect(useStore.getState().openedExRCategoryIds[1]).toBe(true);

		toggleExRCategory(1);
		expect(useStore.getState().openedExRCategoryIds[1]).toBe(false);

		toggleExRCategory(2);
		expect(useStore.getState().openedExRCategoryIds[2]).toBe(true);
		expect(useStore.getState().openedExRCategoryIds[1]).toBe(false);
	});

	it("should set selected tab id", () => {
		const { setSelectedExRTabId } = useStore.getState();

		setSelectedExRTabId(2);
		expect(useStore.getState().selectedExRTabId).toBe(2);
	});

	it("should set isTabPending", () => {
		const { setIsExRTabPending } = useStore.getState();

		setIsExRTabPending(true);
		expect(useStore.getState().isExRTabPending).toBe(true);

		setIsExRTabPending(false);
		expect(useStore.getState().isExRTabPending).toBe(false);
	});

	it("should update and delete preset name", () => {
		const { updatePresetName } = useStore.getState();

		updatePresetName(0, "Test Preset");
		expect(useStore.getState().presetNames[0]).toBe("Test Preset");

		updatePresetName(0, "");
		expect(useStore.getState().presetNames[0]).toBeUndefined();

		updatePresetName(1, "  ");
		expect(useStore.getState().presetNames[1]).toBeUndefined();
	});

	it("should toggle option open state with numeric ID", () => {
		const { toggleExROption } = useStore.getState();

		toggleExROption(10001 as UniqueOptionId);
		expect(useStore.getState().openedExROptionIds[10001]).toBe(true);

		toggleExROption(10001 as UniqueOptionId);
		expect(useStore.getState().openedExROptionIds[10001]).toBe(false);
	});

	it("should set ExR options", () => {
		const { setExROptions } = useStore.getState();
		const valueData = {
			10001: { selection: 1, values: [0, 1] },
		};
		const isOptionActive = {
			10001: true,
		};

		setExROptions(valueData, isOptionActive);

		const state = useStore.getState();
		expect(state.exrValue[10001 as UniqueOptionId].selection).toBe(1);
		expect(state.isExROptionActive[10001 as UniqueOptionId]).toBe(true);
	});

	it("should automatically open newly became accordion options", async () => {
		const { updateExROption, setExROptions } = useStore.getState();

		const api = await import("@/logics/api");
		const { getUniqueOptionId } = await import("@/logics/optionUtils");

		const tabId = 1;
		const catId = 1;
		const parentId = 100;
		const childId = 101;

		const parentUId = getUniqueOptionId(tabId, catId, parentId);
		const childUId = getUniqueOptionId(tabId, catId, childId);

		// Initial state
		setExROptions(
			{
				[parentUId]: { selection: 0, values: [0] },
				[childUId]: { selection: 0, values: [0] },
			},
			{
				[parentUId]: true,
				[childUId]: false, // Child is inactive
			},
		);

		// Mock metaData for children check
		api.exrOptionMetaData.options[parentUId] = {
			metaData: { translatedName: "Parent", format: "", type: "" },
			childOptionIds: [childUId],
			parentOptionIds: [],
		};
		api.exrOptionMetaData.categories[catId] = { name: "Cat", tabId: tabId };

		// Update that makes child active
		updateExROption([
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Cat",
					Options: [
						{
							Id: parentId,
							IsActive: true,
							TranslatedName: "Parent",
							Selection: 0,
							Format: "",
							RangeMeta: { Type: "Single", Values: [0] },
							Childs: [
								{
									Id: childId,
									IsActive: true, // Child becomes active!
									TranslatedName: "Child",
									Selection: 0,
									Format: "",
									RangeMeta: { Type: "Single", Values: [0] },
									Childs: [],
								},
							],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		]);

		expect(useStore.getState().openedExROptionIds[parentUId]).toBe(true);
	});
});
