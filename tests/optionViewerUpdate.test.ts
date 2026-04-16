import { describe, expect, it, vi, beforeEach } from "vitest";
import { create } from "zustand";
import type { OptionViewerSlice } from "../src/slices/optionViewerSlice";
import { createOptionViewerSlice } from "../src/slices/optionViewerSlice";
import * as api from "../src/logics/api";

vi.mock("../src/logics/api", () => ({
	updateExrOption: vi.fn(),
}));

describe("optionViewerSlice - TEMP_updateExROptionSelection", () => {
	const useStore = create<OptionViewerSlice>()((...a) => ({
		...createOptionViewerSlice(...a),
	}));

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		useStore.getState().resetViewer();
	});

	it("should call updateExrOption and manage pending state", async () => {
		const mockResult = {
			UpdatedCategory: null,
			ChainUpdatedOption: [],
		};
		vi.mocked(api.updateExrOption).mockResolvedValueOnce(mockResult);

		const promise = useStore.getState().TEMP_updateExROptionSelection("1-101", 2);

		// ペンディング状態になっていることを確認
		expect(useStore.getState().pendingExROptionIds["1-101"]).toBe(true);

		await promise;

		expect(api.updateExrOption).toHaveBeenCalledWith({
			TabId: 0,
			CategoryId: 1,
			OptionId: 101,
			Selection: 2,
		});

		// 500ms待機してペンディングが解除されることを確認
		await vi.runAllTimersAsync();
		expect(useStore.getState().pendingExROptionIds["1-101"]).toBeUndefined();
	});

	it("should manage category pending state when chain updates occur", async () => {
		const mockResult = {
			UpdatedCategory: null,
			ChainUpdatedOption: [{ Id: 5, Options: [] }],
		};
		vi.mocked(api.updateExrOption).mockResolvedValueOnce(mockResult);

		const promise = useStore.getState().TEMP_updateExROptionSelection("1-101", 2);

		await promise;
		await vi.runAllTimersAsync();

		// 成功後はカテゴリのペンディングも解除されている
		expect(useStore.getState().pendingExRCategoryIds[5]).toBeUndefined();
	});

	it("should clear pending state even on error", async () => {
		vi.mocked(api.updateExrOption).mockRejectedValueOnce(new Error("API Error"));

		const promise = useStore.getState().TEMP_updateExROptionSelection("1-101", 2);

		await promise;

		expect(useStore.getState().pendingExROptionIds["1-101"]).toBeUndefined();
	});
});
