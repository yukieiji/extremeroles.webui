import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getAuCategoryOptions,
	getAuOptions,
	getExrCategoryOptions,
	getExrOptions,
	getExrTabOptions,
	resetApiCache,
} from "../src/logics/api";

describe("Granular API Promise decomposition", () => {
	// We use the real fetch and let MSW handle it, but we can spy on it
	const fetchSpy = vi.spyOn(global, "fetch");

	beforeEach(() => {
		resetApiCache();
		fetchSpy.mockClear();
	});

	it("getExrTabOptions should trigger getExrOptions and return the specific tab", async () => {
		const tab = await getExrTabOptions(0); // GeneralTab in mock data is 0

		expect(fetchSpy).toHaveBeenCalled();
		expect(tab.Id).toBe(0);
		expect(tab.Name).toBe("グローバル設定");
	});

	it("getExrTabOptions should return the same promise instance for the same tabId", () => {
		const p1 = getExrTabOptions(0);
		const p2 = getExrTabOptions(0);
		expect(p1).toBe(p2);
	});

	it("getExrOptions should populate individual tab and category promises", async () => {
		await getExrOptions();

		// Now getExrTabOptions should return a resolved promise without fetching again
		const tab0 = await getExrTabOptions(0);
		expect(tab0.Name).toBe("グローバル設定");

		// Category 1 exists in mock data
		const cat = await getExrCategoryOptions(1);
		expect(cat.Name).toBe("乱数に関する設定");

		// Fetch should have been called only once (by getExrOptions)
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("getExrCategoryOptions should trigger getExrOptions and return the specific category", async () => {
		const category = await getExrCategoryOptions(1);

		expect(fetchSpy).toHaveBeenCalled();
		expect(category.Id).toBe(1);
		expect(category.Name).toBe("乱数に関する設定");
	});

	it("getExrCategoryOptions should return the same promise instance for the same categoryId", () => {
		const p1 = getExrCategoryOptions(1);
		const p2 = getExrCategoryOptions(1);
		expect(p1).toBe(p2);
	});

	it("getAuCategoryOptions should trigger getAuOptions and return the specific category", async () => {
		const category = await getAuCategoryOptions("map");

		expect(fetchSpy).toHaveBeenCalled();
		expect(category.TranslatedTitle).toBe("map");
	});

	it("getAuCategoryOptions should return the same promise instance for the same categoryName", () => {
		const p1 = getAuCategoryOptions("map");
		const p2 = getAuCategoryOptions("map");
		expect(p1).toBe(p2);
	});

	it("getAuOptions should populate individual category promises", async () => {
		await getAuOptions();

		const cat = await getAuCategoryOptions("map");
		expect(cat.TranslatedTitle).toBe("map");
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("resetApiCache should clear granular promises", async () => {
		const p1 = getExrTabOptions(0);
		resetApiCache();
		const p2 = getExrTabOptions(0);

		expect(p1).not.toBe(p2);
	});
});
