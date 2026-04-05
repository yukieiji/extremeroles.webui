import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getAuCategoryOptions,
	getAuOptions,
	getExrOptions,
	getExrTabOptions,
	resetApiCache,
} from "../src/logics/api";

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("Granular API Promise decomposition", () => {
	beforeEach(() => {
		resetApiCache();
		vi.clearAllMocks();
	});

	it("getExrTabOptions should trigger getExrOptions and return the specific tab", async () => {
		const mockTabs = [
			{ Id: 0, Name: "General", Categories: [] },
			{ Id: 1, Name: "Crewmate", Categories: [] },
		];
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => mockTabs,
		} as Response);

		const tabPromise = getExrTabOptions(1);
		expect(fetch).toHaveBeenCalledTimes(1);

		const tab = await tabPromise;
		expect(tab.Id).toBe(1);
		expect(tab.Name).toBe("Crewmate");
	});

	it("getExrTabOptions should return the same promise instance for the same tabId", () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => [{ Id: 0, Name: "General", Categories: [] }],
		} as Response);

		const p1 = getExrTabOptions(0);
		const p2 = getExrTabOptions(0);
		expect(p1).toBe(p2);
	});

	it("getExrOptions should populate individual tab promises", async () => {
		const mockTabs = [
			{ Id: 0, Name: "General", Categories: [] },
			{ Id: 1, Name: "Crewmate", Categories: [] },
		];
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => mockTabs,
		} as Response);

		await getExrOptions();

		// Now getExrTabOptions should return a resolved promise without fetching again
		const p0 = getExrTabOptions(0);
		const tab0 = await p0;
		expect(tab0.Name).toBe("General");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("getAuCategoryOptions should trigger getAuOptions and return the specific category", async () => {
		const mockCategories = [
			{ TranslatedTitle: "Game Settings", Options: [] },
			{ TranslatedTitle: "Role Settings", Options: [] },
		];
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => mockCategories,
		} as Response);

		const categoryPromise = getAuCategoryOptions("Role Settings");
		expect(fetch).toHaveBeenCalledTimes(1);

		const category = await categoryPromise;
		expect(category.TranslatedTitle).toBe("Role Settings");
	});

	it("getAuCategoryOptions should return the same promise instance for the same categoryName", () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => [{ TranslatedTitle: "Game Settings", Options: [] }],
		} as Response);

		const p1 = getAuCategoryOptions("Game Settings");
		const p2 = getAuCategoryOptions("Game Settings");
		expect(p1).toBe(p2);
	});

	it("getAuOptions should populate individual category promises", async () => {
		const mockCategories = [{ TranslatedTitle: "Game Settings", Options: [] }];
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => mockCategories,
		} as Response);

		await getAuOptions();

		const p = getAuCategoryOptions("Game Settings");
		const cat = await p;
		expect(cat.TranslatedTitle).toBe("Game Settings");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("resetApiCache should clear granular promises", async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => [{ Id: 0, Name: "General", Categories: [] }],
		} as Response);

		const p1 = getExrTabOptions(0);
		resetApiCache();
		const p2 = getExrTabOptions(0);

		expect(p1).not.toBe(p2);
	});
});
