import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useStore } from "@/useStore";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/logics/api", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/logics/api")>();
	return {
		...actual,
		globalSearchItems: [
		{
			term: "Apple",
			info: { mode: "au-cat", tabId: 0, categoryId: 1 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		{
			term: "Banana",
			info: { mode: "exr-opt", uniqueOptionId: 100 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		{
			term: "Cherry",
			info: { mode: "exr-opt", uniqueOptionId: 101 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		{
			term: "リンゴ",
			info: { mode: "au-cat", tabId: 0, categoryId: 2 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		{
			term: "みかん",
			info: { mode: "au-cat", tabId: 0, categoryId: 3 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		},
		...Array.from({ length: 10 }, (_, i) => ({
			term: `Item ${i}`,
			info: { mode: "au-cat", tabId: 0, categoryId: i + 10 },
			parentData: { tabName: "T", categoryName: "C", parentOptionNames: [] },
		})),
	],
};
});

describe("useSearchResults", () => {
	it("returns empty array when query is empty", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "",
				isExROptionActive: {},
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toEqual([]);
	});

	it("filters items by query", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "App",
				isExROptionActive: {},
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toHaveLength(1);
		expect(result.current[0].term).toBe("Apple");
	});

	it("filters ExR options by active status", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "a", // matches Apple, Banana
				isExROptionActive: { 100: true }, // Banana active, Cherry (not in query but for completeness)
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		// Apple (au-cat) is always active, Banana (exr-opt) is active
		expect(result.current.map((i) => i.term)).toContain("Apple");
		expect(result.current.map((i) => i.term)).toContain("Banana");
	});

	it("excludes inactive ExR options", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "Banana",
				isExROptionActive: { 100: false },
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toHaveLength(0);
	});

	it("limits results to 10", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "Item",
				isExROptionActive: {},
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toHaveLength(10);
	});

	it("normalizes search query and terms (hiragana/katakana)", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "りんご", // hiragana query for katakana term
				isExROptionActive: {},
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toHaveLength(1);
		expect(result.current[0].term).toBe("リンゴ");
	});

	it("normalizes search query and terms (half-width/full-width)", () => {
		vi.mocked(useStore).mockImplementation((selector) =>
			(selector as (state: unknown) => unknown)({
				optionSearchQuery: "ﾐｶﾝ", // half-width katakana query for hiragana term
				isExROptionActive: {},
			}),
		);

		const { result } = renderHook(() => useSearchResults());
		expect(result.current).toHaveLength(1);
		expect(result.current[0].term).toBe("みかん");
	});
});
