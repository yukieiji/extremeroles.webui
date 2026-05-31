import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createExROptionMetaData,
	exrOptionMetaData,
	resetExrOptionMetaData,
} from "@/logics/api";
import { ExRTabId } from "@/type";

// Mock global fetch
global.fetch = vi.fn();

describe("exrOptionMetaData color assignment", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetExrOptionMetaData();
	});

	it("should assign default color #FFFFFF to GeneralTab if no color tags are present", async () => {
		const mockData = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "General",
				Categories: [
					{
						Id: 1,
						Name: "Category 1",
						Options: [],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockData,
		} as Response);

		await createExROptionMetaData();

		expect(exrOptionMetaData.tabs[ExRTabId.GeneralTab].colors).toEqual([
			"#FFFFFF",
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
						Options: [],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
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
						Options: [],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockData,
		} as Response);

		await createExROptionMetaData();

		expect(exrOptionMetaData.tabs[ExRTabId.CrewmateTab].colors).toEqual([]);
	});
});
