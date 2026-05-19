import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBackendUpdate, useSyncBackend } from "@/hooks/useBackend";
import { refetchAll, resetApiCache } from "@/logics/api.store";
import { useStore } from "@/useStore";

vi.mock("@/logics/api.store", () => ({
	resetApiCache: vi.fn(),
	refetchAll: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/hooks/useManualBlock", () => ({
	useBlock: () => (fn: () => void) => fn(),
	useBlockAsync: () => (fn: () => Promise<void>) => fn(),
}));

describe("useSyncBackend", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sync 関数を呼び出したときに api 関連の処理が実行される", async () => {
		const validateOpenedIds = vi.fn();
		// useStore の状態を部分的にモック化
		useStore.setState({ validateOpenedIds });

		const { result } = renderHook(() => useSyncBackend());

		await act(async () => {
			result.current();
		});

		expect(resetApiCache).toHaveBeenCalled();
		expect(refetchAll).toHaveBeenCalled();
		// startTransition 内で実行されるため、少し待つ必要があるかもしれないが、
		// act でラップしているので同期的に扱えるはず
		expect(validateOpenedIds).toHaveBeenCalled();
	});
});

describe("useBackendUpdate", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("update 関数を呼び出した後に sync が実行される", async () => {
		const { result } = renderHook(() => useBackendUpdate());
		const mockUpdate = vi.fn().mockResolvedValue(undefined);

		await act(async () => {
			await result.current(mockUpdate);
		});

		expect(mockUpdate).toHaveBeenCalled();
		expect(refetchAll).toHaveBeenCalled();
	});
});
