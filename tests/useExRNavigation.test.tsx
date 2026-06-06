import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExROptionNavigation } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
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
		vi.mocked(useStore).mockImplementation((selector) => {
			const state = {
				setSelectedTab,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return selector(state as unknown as Parameters<typeof selector>[0]);
		});
		vi.mocked(useStore).getState = vi.fn().mockReturnValue({
			openedExRCategoryIds: {},
		});
	});

	it("should open all ancestor options when navigating to a child option", () => {
		const childId = 100 as UniqueOptionId;
		const parentId = 200 as UniqueOptionId;
		const grandParentId = 300 as UniqueOptionId;

		const emptyMeta = {} as ExROptionMetaData;

		exrOptionMetaData.options[childId] = {
			metaData: emptyMeta,
			childOptionIds: [],
			parentOptionIds: [parentId, grandParentId],
		};
		exrOptionMetaData.options[parentId] = {
			metaData: emptyMeta,
			childOptionIds: [childId],
			parentOptionIds: [grandParentId],
		};
		exrOptionMetaData.options[grandParentId] = {
			metaData: emptyMeta,
			childOptionIds: [parentId],
			parentOptionIds: [],
		};

		const { result } = renderHook(() => useExROptionNavigation(childId));
		result.current();

		expect(openExROptions).toHaveBeenCalledWith([parentId, grandParentId]);
	});
});
