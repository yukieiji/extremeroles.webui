import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExRNavigation } from "@/hooks/useOptionNavigation";
import * as api from "@/logics/api";
import type { ExROptionMetaData, UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/logics/api", () => ({
	exrOptionMetaData: {
		options: {},
	},
}));

vi.mock("@/logics/optionUtils", () => ({
	parseUniqueOptionId: vi
		.fn()
		.mockReturnValue({ tabId: 1, categoryId: 10, optionId: 100 }),
}));

describe("useExRNavigation", () => {
	const setSelectedTab = vi.fn();
	const setSelectedExRTabId = vi.fn();
	const toggleExRCategory = vi.fn();
	const openExROptions = vi.fn();
	const setHighlightedExROptionId = vi.fn();
	const setRightPanelOpen = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useStore).mockImplementation((selector: unknown) => {
			const state = {
				setSelectedTab,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return (selector as (s: typeof state) => unknown)(state);
		});
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore.getState
		(useStore as any).getState = vi.fn().mockReturnValue({
			openedExRCategoryIds: {},
		});
	});

	it("should open all ancestor options when navigating to a child option", () => {
		const childId = 100 as UniqueOptionId;
		const parentId = 200 as UniqueOptionId;
		const grandParentId = 300 as UniqueOptionId;

		const emptyMeta = {} as ExROptionMetaData;

		api.exrOptionMetaData.options[childId] = {
			metaData: emptyMeta,
			childOptionIds: [],
			parentOptionIds: [parentId, grandParentId],
		};
		api.exrOptionMetaData.options[parentId] = {
			metaData: emptyMeta,
			childOptionIds: [childId],
			parentOptionIds: [grandParentId],
		};
		api.exrOptionMetaData.options[grandParentId] = {
			metaData: emptyMeta,
			childOptionIds: [parentId],
			parentOptionIds: [],
		};

		const { result } = renderHook(() => useExRNavigation(childId));
		result.current();

		expect(openExROptions).toHaveBeenCalledWith([parentId, grandParentId]);
	});
});
