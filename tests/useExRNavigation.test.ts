import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useExRNavigation } from "../src/hooks/useExRNavigation";
import type { UniqueOptionId } from "../src/type";
import { OptionTab } from "../src/type";
import { useStore } from "../src/useStore";

describe("useExRNavigation", () => {
	it("updates store and triggers scroll on navigation", async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useExRNavigation());

		const tabId = OptionTab.CrewmateTab;
		const categoryId = 500;
		const optionId = 600 as UniqueOptionId;

		const scrollIntoViewSpy = vi.fn();
		const mockElement = {
			scrollIntoView: scrollIntoViewSpy,
		} as HTMLElement;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		act(() => {
			result.current.navigateToExROption(tabId, categoryId, optionId);
		});

		const state = useStore.getState();
		expect(state.selectedTab).toBe("ExR");
		expect(state.selectedExRTabId).toBe(tabId);
		expect(state.highlightedExROptionId).toBe(optionId);
		expect(state.isRightPanelOpen).toBe(false);

		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(scrollIntoViewSpy).toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(2100);
		});

		expect(useStore.getState().highlightedExROptionId).toBeNull();

		vi.useRealTimers();
	});
});
