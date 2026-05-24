import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createAuOptionMetaData,
	createExROptionMetaData,
	globalSearchItems,
	resetAuOptionMetaData,
	resetExrOptionMetaData,
} from "@/logics/api";
import { ExRTabId, OptionValueType } from "@/type";

// Mock global fetch
global.fetch = vi.fn();

describe("OptionSearchBar logic (globalSearchItems)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetAuOptionMetaData();
		resetExrOptionMetaData();
	});

	it("should populate globalSearchItems with Au metadata and context", async () => {
		const mockAuData = [
			{
				TranslatedTitle: "AuCategory",
				Options: [
					{
						TranslatedTitle: "AuOption",
						TranslatedFormat: "Format",
						Value: 10,
						Info: { ValueType: OptionValueType.Int, OptionName: 1 },
						Range: [0, 10, 20],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockAuData,
		} as Response);

		await createAuOptionMetaData();

		const categorySearch = globalSearchItems.find(
			(i) => i.term === "AuCategory",
		);
		const optionSearch = globalSearchItems.find((i) => i.term === "AuOption");

		expect(categorySearch).toBeDefined();
		expect(categorySearch?.info.mode).toBe("au-cat");
		expect(categorySearch?.context).toBe("Tab 0");
		expect(optionSearch).toBeDefined();
		expect(optionSearch?.info.mode).toBe("au-opt");
		expect(optionSearch?.context).toBe("AuCategory");
	});

	it("should populate globalSearchItems with ExR metadata and context", async () => {
		const mockExRData = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "General",
				Categories: [
					{
						Id: 1,
						Name: "ExRCategory",
						Options: [
							{
								Id: 10,
								IsActive: true,
								TranslatedName: "ExROption",
								Selection: 0,
								Format: "format",
								RangeMeta: { Type: "Int32", Values: [0, 1, 2] },
								Childs: [
									{
										Id: 11,
										IsActive: true,
										TranslatedName: "ChildOption",
										Selection: 0,
										Format: "format",
										RangeMeta: { Type: "Int32", Values: [0, 1] },
										Childs: [],
									},
								],
							},
						],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockExRData,
		} as Response);

		await createExROptionMetaData();

		const categorySearch = globalSearchItems.find(
			(i) => i.term === "ExRCategory",
		);
		const optionSearch = globalSearchItems.find((i) => i.term === "ExROption");
		const childSearch = globalSearchItems.find((i) => i.term === "ChildOption");

		expect(categorySearch).toBeDefined();
		expect(categorySearch?.info.mode).toBe("exr-cat");
		expect(optionSearch).toBeDefined();
		expect(optionSearch?.info.mode).toBe("exr-opt");
		expect(optionSearch?.context).toBe("ExRCategory");

		expect(childSearch).toBeDefined();
		expect(childSearch?.context).toBe("ExRCategory > ExROption");
	});

	it("should clear old items when re-populating", async () => {
		const mockAuData = [
			{
				TranslatedTitle: "AuCategory",
				Options: [
					{
						TranslatedTitle: "AuOption",
						TranslatedFormat: "Format",
						Value: 10,
						Info: { ValueType: OptionValueType.Int, OptionName: 1 },
						Range: [0, 10, 20],
					},
				],
			},
		];

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockAuData,
		} as Response);

		await createAuOptionMetaData();
		const initialCount = globalSearchItems.length;

		await createAuOptionMetaData();
		expect(globalSearchItems.length).toBe(initialCount);
	});
});
