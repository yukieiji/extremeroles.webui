import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import {
	getAuCategoryOptions,
	getAuOptions,
	getExrCategoryOptions,
	getExrOptions,
	getExrTabOptions,
	resetApiCache,
} from "../src/logics/api";
import { server } from "./msw-server";

describe("Granular API Promise decomposition", () => {
	beforeEach(() => {
		resetApiCache();
	});

	it("getExrTabOptions should return the specific tab", async () => {
		const mockTabs = [
			{ Id: 0, Name: "General", Categories: [] },
			{ Id: 1, Name: "Crewmate", Categories: [] },
		];
		server.use(http.get("/exr/option/", () => HttpResponse.json(mockTabs)));

		const tab = await getExrTabOptions(1);

		expect(tab.Id).toBe(1);
		expect(tab.Name).toBe("Crewmate");
	});

	it("getExrTabOptions should return the same promise instance for the same tabId", () => {
		const p1 = getExrTabOptions(0);
		const p2 = getExrTabOptions(0);
		expect(p1).toBe(p2);
	});

	it("getExrOptions should populate individual tab and category promises", async () => {
		const mockTabs = [
			{
				Id: 0,
				Name: "General",
				Categories: [{ Id: 10, Name: "SubCat", Options: [] }],
			},
			{ Id: 1, Name: "Crewmate", Categories: [] },
		];
		server.use(http.get("/exr/option/", () => HttpResponse.json(mockTabs)));

		await getExrOptions();

		const tab0 = await getExrTabOptions(0);
		expect(tab0.Name).toBe("General");

		const cat = await getExrCategoryOptions(10);
		expect(cat.Name).toBe("SubCat");
	});

	it("getExrCategoryOptions should return the specific category", async () => {
		const mockTabs = [
			{
				Id: 0,
				Name: "General",
				Categories: [{ Id: 10, Name: "SubCat", Options: [] }],
			},
		];
		server.use(http.get("/exr/option/", () => HttpResponse.json(mockTabs)));

		const category = await getExrCategoryOptions(10);

		expect(category.Id).toBe(10);
		expect(category.Name).toBe("SubCat");
	});

	it("getExrCategoryOptions should return the same promise instance for the same categoryId", () => {
		const p1 = getExrCategoryOptions(10);
		const p2 = getExrCategoryOptions(10);
		expect(p1).toBe(p2);
	});

	it("getAuCategoryOptions should return the specific category", async () => {
		const mockCategories = [
			{ TranslatedTitle: "map", Options: [] },
			{ TranslatedTitle: "クルー", Options: [] },
		];
		server.use(
			http.get("/au/option/", () => HttpResponse.json(mockCategories)),
		);

		const category = await getAuCategoryOptions("クルー");

		expect(category.TranslatedTitle).toBe("クルー");
	});

	it("getAuCategoryOptions should return the same promise instance for the same categoryName", () => {
		const p1 = getAuCategoryOptions("map");
		const p2 = getAuCategoryOptions("map");
		expect(p1).toBe(p2);
	});

	it("getAuOptions should populate individual category promises", async () => {
		const mockCategories = [{ TranslatedTitle: "map", Options: [] }];
		server.use(
			http.get("/au/option/", () => HttpResponse.json(mockCategories)),
		);

		await getAuOptions();

		const cat = await getAuCategoryOptions("map");
		expect(cat.TranslatedTitle).toBe("map");
	});

	it("resetApiCache should clear granular promises", async () => {
		const p1 = getExrTabOptions(0);
		resetApiCache();
		const p2 = getExrTabOptions(0);

		expect(p1).not.toBe(p2);
	});
});
