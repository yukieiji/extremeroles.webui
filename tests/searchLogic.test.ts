import { beforeEach, describe, expect, it } from "vitest";
import {
	auOptionMetaData,
	buildSearchItems,
	exrOptionMetaData,
	globalSearchItems,
} from "@/logics/api";
import { ExRTabId, type UniqueOptionId } from "@/type";

describe("buildSearchItems", () => {
	beforeEach(() => {
		globalSearchItems.length = 0;
		auOptionMetaData.tabCategoryMap = {};
		auOptionMetaData.categoryMetaData = {};
		auOptionMetaData.options = {};
		exrOptionMetaData.categories = {};
		exrOptionMetaData.options = {};
		// biome-ignore lint/suspicious/noExplicitAny: mock metadata
		exrOptionMetaData.tabs = {} as any;
	});

	it("should populate search items from Au metadata", () => {
		auOptionMetaData.tabCategoryMap = { 0: [10] };
		auOptionMetaData.categoryMetaData[10] = {
			name: "Au Category",
			// biome-ignore lint/suspicious/noExplicitAny: mock options
			options: [100 as any],
		};
		// biome-ignore lint/suspicious/noExplicitAny: mock options
		auOptionMetaData.options[100 as any] = {
			title: "Au Option",
			format: "",
			range: [1, 2],
		};

		buildSearchItems();

		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				tearm: "Au Category",
				info: expect.objectContaining({ mode: "au-cat" }),
			}),
		);
		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				tearm: "Au Option",
				info: expect.objectContaining({ mode: "au-opt" }),
			}),
		);
	});

	it("should populate search items from ExR metadata", () => {
		exrOptionMetaData.categories[20] = {
			name: "ExR Category",
			tabId: ExRTabId.GeneralTab,
		};
		exrOptionMetaData.options[2000 as UniqueOptionId] = {
			metaData: {
				translatedName: "ExR Option",
				format: "",
				type: "Int32",
			},
			childOptionIds: [],
			parentOptionIds: [],
		};

		buildSearchItems();

		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				tearm: "ExR Category",
				info: expect.objectContaining({ mode: "exr-cat" }),
			}),
		);
		expect(globalSearchItems).toContainEqual(
			expect.objectContaining({
				tearm: "ExR Option",
				info: expect.objectContaining({ mode: "exr-opt" }),
			}),
		);
	});

	it("should sort items correctly", () => {
		// au-cat (0), au-opt (1), exr-cat (2), exr-opt (3)

		// biome-ignore lint/suspicious/noExplicitAny: mock tabId
		exrOptionMetaData.categories[1] = { name: "B", tabId: 0 as any };
		auOptionMetaData.tabCategoryMap = { 0: [1] };
		auOptionMetaData.categoryMetaData[1] = { name: "A", options: [] };

		buildSearchItems();

		expect(globalSearchItems[0].tearm).toBe("A"); // au-cat
		expect(globalSearchItems[1].tearm).toBe("B"); // exr-cat
	});

	it("should sort by name within same mode", () => {
		auOptionMetaData.tabCategoryMap = { 0: [1, 2] };
		auOptionMetaData.categoryMetaData[1] = { name: "B", options: [] };
		auOptionMetaData.categoryMetaData[2] = { name: "A", options: [] };

		buildSearchItems();

		expect(globalSearchItems[0].tearm).toBe("A");
		expect(globalSearchItems[1].tearm).toBe("B");
	});
});
