import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "../src/useStore";

describe("OptionViewerStore", () => {
	beforeEach(() => {
		// ストアを初期状態にリセット
		useStore.setState({
			selectedExRTabId: 0,
		});
	});

	it("初期状態が正しいこと", () => {
		const state = useStore.getState();
		expect(state.selectedExRTabId).toBe(0);
	});

	it("setSelectedExRTabId で selectedExRTabId が変更されること", () => {
		useStore.getState().setSelectedExRTabId(1);
		expect(useStore.getState().selectedExRTabId).toBe(1);

		useStore.getState().setSelectedExRTabId(2);
		expect(useStore.getState().selectedExRTabId).toBe(2);
	});
});
