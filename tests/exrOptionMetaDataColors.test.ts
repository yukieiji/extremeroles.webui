import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	createExROptionMetaData,
	exrOptionMetaData,
	resetExrOptionMetaData,
} from "@/logics/api";
import { ExRTabId } from "@/type";

describe("exrOptionMetaData color assignment", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
		resetExrOptionMetaData();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("should assign default color #CCCC00 to GeneralTab if no color tags are present", async () => {
		const mockData = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "General",
				Categories: [
					{
						Id: 1,
						Name: "Category 1",
						ColorCode: null,
						Options: [],
					},
				],
			},
		];

		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockData,
		} as Response);

		await createExROptionMetaData();

		expect(exrOptionMetaData.tabs[ExRTabId.GeneralTab].colors).toEqual([
			"#CCCC00",
		]);
	});

	it("should extract colors from GeneralTab if color tags are present", async () => {
		const mockData = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "<color=#FF0000>General</color>",
				Categories: [
					{
						Id: 1,
						Name: "Category 1",
						ColorCode: null,
						Options: [],
					},
				],
			},
		];

		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockData,
		} as Response);

		await createExROptionMetaData();

		expect(exrOptionMetaData.tabs[ExRTabId.GeneralTab].colors).toEqual([
			"#FF0000",
		]);
	});

	it("should NOT assign default color to other tabs if no color tags are present", async () => {
		const mockData = [
			{
				Id: ExRTabId.CrewmateTab,
				Name: "Crewmate",
				Categories: [
					{
						Id: 2,
						Name: "Category 2",
						ColorCode: null,
						Options: [],
					},
				],
			},
		];

		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockData,
		} as Response);

		await createExROptionMetaData();

		expect(exrOptionMetaData.tabs[ExRTabId.CrewmateTab].colors).toEqual([]);
	});
});
