import { beforeEach, describe, expect, it, vi } from "vitest";
import { create } from "zustand";
import * as api from "../src/logics/api";
import type { OptionViewerSlice } from "../src/slices/optionViewerSlice";
import { createOptionViewerSlice } from "../src/slices/optionViewerSlice";

vi.mock("../src/logics/api", () => ({
	updateExrOption: vi.fn(),
}));

describe("optionViewerSlice - updateExROptionSelection", () => {
	const useStore = create<OptionViewerSlice>()((...a) => ({
		...createOptionViewerSlice(...a),
	}));

	beforeEach(() => {
		vi.clearAllMocks();
		useStore.getState().resetViewer();
	});

	it("should call updateExrOption and manage pending state", async () => {
		const mockResult = {
			UpdatedCategory: null,
			ChainUpdatedOption: [],
		};
		vi.mocked(api.updateExrOption).mockResolvedValueOnce(mockResult);

		const uniqueId = 10101; // Category 1, Option 101
		const promise = useStore.getState().updateExROptionSelection(uniqueId, 2);

		// ペンディング状態になっていることを確認
		expect(useStore.getState().pendingExROptionIds[uniqueId]).toBe(true);

		await promise;

		expect(api.updateExrOption).toHaveBeenCalledWith({
			TabId: 0,
			CategoryId: 1,
			OptionId: 101,
			Selection: 2,
		});

		// ペンディング状態が解除されていることを確認
		expect(useStore.getState().pendingExROptionIds[uniqueId]).toBeUndefined();
	});

	it("should manage category pending state when chain updates occur", async () => {
		const mockResult = {
			UpdatedCategory: null,
			ChainUpdatedOption: [{ Id: 5, Options: [] }],
		};
		vi.mocked(api.updateExrOption).mockResolvedValueOnce(mockResult);

		const uniqueId = 10101;
		const promise = useStore.getState().updateExROptionSelection(uniqueId, 2);

		await promise;

		// 成功後はカテゴリのペンディングも解除されている
		expect(useStore.getState().pendingExRCategoryIds[5]).toBeUndefined();
	});

	it("should clear pending state even on error", async () => {
		vi.mocked(api.updateExrOption).mockRejectedValueOnce(
			new Error("API Error"),
		);

		const uniqueId = 10101;
		const promise = useStore.getState().updateExROptionSelection(uniqueId, 2);

		await promise;

		expect(useStore.getState().pendingExROptionIds[uniqueId]).toBeUndefined();
	});
});
