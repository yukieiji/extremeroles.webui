import { describe, expect, it } from "vitest";
import { create } from "zustand";
import type { OptionViewerSlice } from "../src/slices/optionViewerSlice";
import { createOptionViewerSlice } from "../src/slices/optionViewerSlice";

describe("optionViewerSlice", () => {
	const useStore = create<OptionViewerSlice>()((...a) => ({
		...createOptionViewerSlice(...a),
	}));

	it("should have initial state", () => {
		const state = useStore.getState();
		expect(state.selectedExRTabId).toBe(0);
		expect(state.isTabPending).toBe(false);
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
		const { setIsTabPending } = useStore.getState();

		setIsTabPending(true);
		expect(useStore.getState().isTabPending).toBe(true);

		setIsTabPending(false);
		expect(useStore.getState().isTabPending).toBe(false);
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
});
