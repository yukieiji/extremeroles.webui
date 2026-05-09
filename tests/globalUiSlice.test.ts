import { describe, expect, it, vi } from "vitest";
import { createGlobalUiSlice } from "@/slices/globalUiSlice";

describe("globalUiSlice", () => {
	it("should have initial search state", () => {
		const set = () => {};
		const get = () => ({});
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, get as any, {} as any);

		expect(slice.optionSearchQuery).toBe("");
		expect(slice.isOptionSearchFocused).toBe(false);
	});

	it("should update search query", () => {
		let state = { optionSearchQuery: "" };
		// biome-ignore lint/suspicious/noExplicitAny: mock set
		const set = (update: any) => {
			state = { ...state, ...update };
		};
		const get = () => state;
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, get as any, {} as any);

		slice.setOptionSearchQuery("test");
		expect(state.optionSearchQuery).toBe("test");
	});

	it("should update search focus", () => {
		let state = { isOptionSearchFocused: false };
		// biome-ignore lint/suspicious/noExplicitAny: mock set
		const set = (update: any) => {
			state = { ...state, ...update };
		};
		const get = () => state;
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, get as any, {} as any);

		slice.setIsOptionSearchFocused(true);
		expect(state.isOptionSearchFocused).toBe(true);
	});

	it("should update role search query if dialog is roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setRoleSearchQuery("test-role");
		const updateFn = set.mock.calls[0][0];

		const stateWithDialog = {
			blockDialog: { type: "roleSelect", searchQuery: "" },
		};
		const result = updateFn(stateWithDialog);
		expect(result.blockDialog.searchQuery).toBe("test-role");

		const stateWithoutDialog = { blockDialog: undefined };
		const result2 = updateFn(stateWithoutDialog);
		expect(result2).toBe(stateWithoutDialog);
	});

	it("should update selected role ids if dialog is roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setSelectedRoleIds([1, 2]);
		const updateFn = set.mock.calls[0][0];

		const stateWithDialog = {
			blockDialog: { type: "roleSelect", selectedRoleIds: [] },
		};
		const result = updateFn(stateWithDialog);
		expect(result.blockDialog.selectedRoleIds).toEqual([1, 2]);

		const stateWithoutDialog = { blockDialog: { type: "confirm" } };
		const result2 = updateFn(stateWithoutDialog);
		expect(result2).toBe(stateWithoutDialog);
	});

	it("should update last clicked id if dialog is roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setLastClickedId(123);
		const updateFn = set.mock.calls[0][0];

		const stateWithDialog = {
			blockDialog: { type: "roleSelect", lastClickedId: null },
		};
		const result = updateFn(stateWithDialog);
		expect(result.blockDialog.lastClickedId).toBe(123);

		const stateWithoutDialog = { blockDialog: undefined };
		const result2 = updateFn(stateWithoutDialog);
		expect(result2).toBe(stateWithoutDialog);
	});

	it("should set pending block", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);
		slice.setPendingBlock(true);
		expect(set).toHaveBeenCalledWith({ isPendingBlock: true });
	});

	it("should push block count", () => {
		const set = vi.fn();
		const get = vi.fn().mockReturnValue({ blockCount: 5 });
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, get as any, {} as any);
		slice.pushBlockCount();
		expect(set).toHaveBeenCalledWith({ blockCount: 6 });
	});

	it("should pop block count", () => {
		const set = vi.fn();
		const get = vi.fn().mockReturnValue({ blockCount: 5 });
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, get as any, {} as any);
		slice.popBlockCount();
		expect(set).toHaveBeenCalledWith({ blockCount: 4 });

		const getZero = vi.fn().mockReturnValue({ blockCount: 0 });
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const sliceZero = createGlobalUiSlice(
			set as any,
			getZero as any,
			{} as any,
		);
		sliceZero.popBlockCount();
		expect(set).toHaveBeenCalledWith({ blockCount: 0 });
	});

	it("should open and close block dialog", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);
		const dialog = {
			type: "confirm",
			title: "T",
			message: "M",
			onConfirm: () => {},
		};
		// biome-ignore lint/suspicious/noExplicitAny: mock dialog
		slice.openBlockDialog(dialog as any);
		expect(set).toHaveBeenCalledWith({ blockDialog: dialog });

		slice.closeBlockDialog();
		expect(set).toHaveBeenCalledWith({ blockDialog: undefined });
	});

	it("should NOT update role search query if dialog is NOT roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setRoleSearchQuery("test-role");
		const updateFn = set.mock.calls[0][0];

		const stateWithOtherDialog = {
			blockDialog: { type: "confirm" },
		};
		const result = updateFn(stateWithOtherDialog);
		expect(result).toBe(stateWithOtherDialog);
	});

	it("should NOT update selected role ids if dialog is NOT roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setSelectedRoleIds([1, 2]);
		const updateFn = set.mock.calls[0][0];

		const stateWithoutDialog = { blockDialog: undefined };
		const result = updateFn(stateWithoutDialog);
		expect(result).toBe(stateWithoutDialog);
	});

	it("should NOT update last clicked id if dialog is NOT roleSelect", () => {
		const set = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: mock store
		const slice = createGlobalUiSlice(set as any, vi.fn() as any, {} as any);

		slice.setLastClickedId(123);
		const updateFn = set.mock.calls[0][0];

		const stateWithOtherDialog = {
			blockDialog: { type: "settings" },
		};
		const result = updateFn(stateWithOtherDialog);
		expect(result).toBe(stateWithOtherDialog);
	});
});
