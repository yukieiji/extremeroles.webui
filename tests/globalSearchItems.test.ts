import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createAuOptionMetaData,
	createExROptionMetaData,
	globalSearchItems,
} from "@/logics/api";
import { refetchAll } from "@/logics/api.store";
import type { UniqueOptionId } from "@/type";

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("globalSearchItems population", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		globalSearchItems.length = 0;
	});

	it("should clear globalSearchItems in refetchAll", async () => {
		globalSearchItems.push({
			term: "old",
			info: {
				mode: "exr-opt",
				uniqueOptionId: 1 as UniqueOptionId,
				parentUniqueOptionIds: [],
			},
		});
		expect(globalSearchItems.length).toBe(1);

		// Mocking all internal calls of refetchAll
		mockFetch.mockImplementation((url: string) => {
			let data: unknown = [];
			if (url.includes("/exr/role/filter/")) {
				data = {
					FilterSet: {},
					FilterRoleId: [],
					NormalRoleId: {},
					CombinationId: {},
					GhostRoleId: {},
				};
			}
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve(data),
			});
		});

		await refetchAll();
		// Since we mocked with empty arrays, it should be empty but importantly, the "old" item should be gone.
		expect(globalSearchItems.find((i) => i.term === "old")).toBeUndefined();
	});

	it("should populate globalSearchItems with ExR data", async () => {
		const mockExRData = [
			{
				Id: 0,
				Name: "Tab 1",
				Categories: [
					{
						Id: 10,
						Name: "Category 10",
						ColorCode: null,
						Options: [
							{
								Id: 100,
								TranslatedName: "Option 100",
								IsActive: true,
								Selection: 0,
								Format: "Format1",
								RangeMeta: { Type: "Int32", Values: [0, 1] },
								Childs: [],
							},
						],
					},
				],
			},
		];

		mockFetch.mockImplementation((url: string) => {
			if (url.includes("/exr/option/")) {
				return Promise.resolve({
					ok: true,
					status: 200,
					json: () => Promise.resolve(mockExRData),
				});
			}
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve([]),
			});
		});

		await createExROptionMetaData();

		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				term: "Category 10",
				info: expect.objectContaining({ mode: "exr-cat", categoryId: 10 }),
			}),
		);
		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				term: "Option 100",
				info: expect.objectContaining({ mode: "exr-opt" }),
			}),
		);
	});

	it("should populate globalSearchItems with Au data", async () => {
		const mockAuData = [
			{
				// First category in Tab 0 is treated as Map
				TranslatedTitle: "Map Category",
				Options: [
					{
						TranslatedTitle: "map",
						TranslatedFormat: "Format",
						Value: 0,
						Info: { ValueType: 2, OptionName: 1000 },
						Range: [0, 1],
					},
				],
			},
			{
				// Second category in Tab 0 is treated normally
				TranslatedTitle: "Normal Category",
				Options: [
					{
						TranslatedTitle: "Normal Option",
						TranslatedFormat: "Format",
						Value: 0,
						Info: { ValueType: 2, OptionName: 1001 },
						Range: [0, 1],
					},
				],
			},
		];

		mockFetch.mockImplementation((url: string) => {
			if (url.includes("/au/option/")) {
				return Promise.resolve({
					ok: true,
					status: 200,
					json: () => Promise.resolve(mockAuData),
				});
			}
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve([]),
			});
		});

		await createAuOptionMetaData();

		// Map category itself should NOT be in globalSearchItems as au-cat
		expect(globalSearchItems).not.toContainEqual(
			expect.objectContaining({
				info: expect.objectContaining({ mode: "au-cat", categoryId: 0 }),
			}),
		);

		// Normal category should be in globalSearchItems as au-cat
		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				term: "Normal Category",
				info: expect.objectContaining({ mode: "au-cat", categoryId: 1 }),
			}),
		);

		// Normal option should be in globalSearchItems as au-opt
		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				term: "Normal Option",
				info: expect.objectContaining({ mode: "au-opt", categoryId: 1 }),
			}),
		);
	});
});
