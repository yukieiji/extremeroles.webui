import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchNavigation } from "@/hooks/useOptionNavigation";
import * as api from "@/logics/api";
import { parseUniqueOptionId } from "@/logics/optionUtils";
import type { ExROptionMetaData, SearchItem, UniqueOptionId } from "@/type";
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
	parseUniqueOptionId: vi.fn(),
	createExRNavigateId: vi.fn().mockReturnValue("exr-nav-id"),
	createAuNavigateId: vi.fn().mockReturnValue("au-nav-id"),
}));

describe("useSearchNavigation", () => {
	const setSelectedTab = vi.fn();
	const setSelectedAuTabId = vi.fn();
	const toggleAuCategory = vi.fn();
	const setHighlightedAuOptionId = vi.fn();
	const setSelectedExRTabId = vi.fn();
	const toggleExRCategory = vi.fn();
	const openExROptions = vi.fn();
	const setHighlightedExROptionId = vi.fn();
	const setRightPanelOpen = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				setSelectedTab,
				setSelectedAuTabId,
				toggleAuCategory,
				setHighlightedAuOptionId,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return selector(state);
		});
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore.getState
		(useStore as any).getState = vi.fn().mockReturnValue({
			openedAuCategoryIds: {},
			openedExRCategoryIds: {},
		});
	});

	it("should navigate to au-cat correctly", () => {
		const item: SearchItem = {
			id: "au-cat-1",
			tearm: "cat",
			info: { mode: "au-cat", tabId: 0, categoryId: 1 },
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setSelectedTab).toHaveBeenCalledWith("Au");
		expect(setSelectedAuTabId).toHaveBeenCalledWith(0);
		expect(toggleAuCategory).toHaveBeenCalledWith(1);
	});

	it("should navigate to au-opt correctly", () => {
		const item: SearchItem = {
			id: "au-opt-1",
			tearm: "opt",
			// biome-ignore lint/suspicious/noExplicitAny: mock auOptionId
			info: { mode: "au-opt", tabId: 0, categoryId: 1, auOptionId: 100 as any },
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setSelectedTab).toHaveBeenCalledWith("Au");
		expect(setHighlightedAuOptionId).toHaveBeenCalledWith(100);
	});

	it("should navigate to exr-cat correctly", () => {
		const item: SearchItem = {
			id: "exr-cat-1",
			tearm: "cat",
			// biome-ignore lint/suspicious/noExplicitAny: mock tabId
			info: { mode: "exr-cat", tabId: 0 as any, categoryId: 1 },
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setSelectedTab).toHaveBeenCalledWith("ExR");
		expect(setSelectedExRTabId).toHaveBeenCalledWith(0);
		expect(toggleExRCategory).toHaveBeenCalledWith(1);
	});

	it("should navigate to exr-opt correctly", () => {
		const uniqueId = 1000 as UniqueOptionId;
		vi.mocked(parseUniqueOptionId).mockReturnValue({
			tabId: 1,
			categoryId: 10,
			optionId: 100,
		});

		const item: SearchItem = {
			id: "exr-opt-1",
			tearm: "opt",
			info: { mode: "exr-opt", uniqueOptionId: uniqueId },
		};

		api.exrOptionMetaData.options[uniqueId] = {
			metaData: {} as ExROptionMetaData,
			childOptionIds: [],
			// biome-ignore lint/suspicious/noExplicitAny: mock parentOptionIds
			parentOptionIds: [200 as any],
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setSelectedTab).toHaveBeenCalledWith("ExR");
		expect(setSelectedExRTabId).toHaveBeenCalledWith(1);
		expect(openExROptions).toHaveBeenCalledWith([200]);
		expect(setHighlightedExROptionId).toHaveBeenCalledWith(uniqueId);
	});

	it("should handle exr-opt with multiple ancestors", () => {
		const uniqueId = 1000 as UniqueOptionId;
		const parentId = 2000 as UniqueOptionId;
		const grandParentId = 3000 as UniqueOptionId;

		vi.mocked(parseUniqueOptionId).mockReturnValue({
			tabId: 1,
			categoryId: 10,
			optionId: 100,
		});

		const item: SearchItem = {
			id: "exr-opt-1",
			tearm: "opt",
			info: { mode: "exr-opt", uniqueOptionId: uniqueId },
		};

		api.exrOptionMetaData.options[uniqueId] = {
			metaData: {} as ExROptionMetaData,
			childOptionIds: [],
			parentOptionIds: [parentId, grandParentId],
		};
		api.exrOptionMetaData.options[parentId] = {
			metaData: {} as ExROptionMetaData,
			childOptionIds: [uniqueId],
			parentOptionIds: [grandParentId],
		};
		api.exrOptionMetaData.options[grandParentId] = {
			metaData: {} as ExROptionMetaData,
			childOptionIds: [parentId],
			parentOptionIds: [],
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(openExROptions).toHaveBeenCalledWith([parentId, grandParentId]);
	});

	it("should not open categories if already open", () => {
		const item: SearchItem = {
			id: "au-cat-1",
			tearm: "cat",
			info: { mode: "au-cat", tabId: 0, categoryId: 1 },
		};

		// biome-ignore lint/suspicious/noExplicitAny: mock useStore
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				setSelectedTab,
				setSelectedAuTabId,
				toggleAuCategory,
				setHighlightedAuOptionId,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return selector(state);
		});
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore.getState
		(useStore as any).getState = vi.fn().mockReturnValue({
			openedAuCategoryIds: { 1: true },
			openedExRCategoryIds: { 10: true },
		});

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(toggleAuCategory).not.toHaveBeenCalled();
	});

	it("should navigate to exr-opt correctly when no ancestors", () => {
		const uniqueId = 1000 as UniqueOptionId;
		vi.mocked(parseUniqueOptionId).mockReturnValue({
			tabId: 1,
			categoryId: 10,
			optionId: 100,
		});

		const item: SearchItem = {
			id: "exr-opt-1",
			tearm: "opt",
			info: { mode: "exr-opt", uniqueOptionId: uniqueId },
		};

		api.exrOptionMetaData.options[uniqueId] = {
			metaData: {} as ExROptionMetaData,
			childOptionIds: [],
			parentOptionIds: [],
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setSelectedTab).toHaveBeenCalledWith("ExR");
		expect(openExROptions).not.toHaveBeenCalled();
	});

	it("should setHighlightedAuOptionId to null for au-cat", () => {
		const item: SearchItem = {
			id: "au-cat-1",
			tearm: "cat",
			info: { mode: "au-cat", tabId: 0, categoryId: 1 },
		};

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(setHighlightedAuOptionId).toHaveBeenCalledWith(null);
	});

	it("should not toggle exr-cat if already open", () => {
		const item: SearchItem = {
			id: "exr-cat-1",
			tearm: "cat",
			// biome-ignore lint/suspicious/noExplicitAny: mock tabId
			info: { mode: "exr-cat", tabId: 0 as any, categoryId: 10 },
		};

		// biome-ignore lint/suspicious/noExplicitAny: mock useStore
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				setSelectedTab,
				setSelectedAuTabId,
				toggleAuCategory,
				setHighlightedAuOptionId,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return selector(state);
		});
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore.getState
		(useStore as any).getState = vi.fn().mockReturnValue({
			openedAuCategoryIds: {},
			openedExRCategoryIds: { 10: true },
		});

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(toggleExRCategory).not.toHaveBeenCalled();
	});

	it("should not toggle exr category if exr-opt category already open", () => {
		const uniqueId = 1000 as UniqueOptionId;
		vi.mocked(parseUniqueOptionId).mockReturnValue({
			tabId: 1,
			categoryId: 10,
			optionId: 100,
		});

		const item: SearchItem = {
			id: "exr-opt-1",
			tearm: "opt",
			info: { mode: "exr-opt", uniqueOptionId: uniqueId },
		};

		// biome-ignore lint/suspicious/noExplicitAny: mock useStore
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				setSelectedTab,
				setSelectedAuTabId,
				toggleAuCategory,
				setHighlightedAuOptionId,
				setSelectedExRTabId,
				toggleExRCategory,
				openExROptions,
				setHighlightedExROptionId,
				setRightPanelOpen,
			};
			return selector(state);
		});
		// biome-ignore lint/suspicious/noExplicitAny: mock useStore.getState
		(useStore as any).getState = vi.fn().mockReturnValue({
			openedAuCategoryIds: {},
			openedExRCategoryIds: { 10: true },
		});

		const { result } = renderHook(() => useSearchNavigation());
		result.current(item);

		expect(toggleExRCategory).not.toHaveBeenCalled();
	});
});
