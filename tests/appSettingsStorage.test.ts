import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	loadAppSettingsFromLocalStorage,
	saveAppSettingsToLocalStorage,
} from "@/logics/storageUtils";

describe("appSettingsStorage", () => {
	beforeEach(() => {
		// LocalStorageをクリア
		window.localStorage.clear();
		vi.clearAllMocks();
	});

	it("should save and load app settings correctly from LocalStorage", () => {
		const settings = { defaultTab: "ExR" as const, defaultCategoryOpen: true };
		saveAppSettingsToLocalStorage(settings);

		const loaded = loadAppSettingsFromLocalStorage();
		expect(loaded).toEqual(settings);
	});

	it("should return default settings if LocalStorage item is missing", () => {
		const loaded = loadAppSettingsFromLocalStorage();
		expect(loaded).toEqual({
			defaultTab: "Au",
			defaultCategoryOpen: false,
		});
	});

	it("should handle corrupted LocalStorage data by returning default settings", () => {
		window.localStorage.setItem("app_settings", "invalid-json");
		const loaded = loadAppSettingsFromLocalStorage();
		expect(loaded).toEqual({
			defaultTab: "Au",
			defaultCategoryOpen: false,
		});
	});

	it("should handle schema mismatch for defaultTab by using fallback", () => {
		window.localStorage.setItem(
			"app_settings",
			JSON.stringify({ defaultTab: "InvalidTab", defaultCategoryOpen: true }),
		);
		const loaded = loadAppSettingsFromLocalStorage();
		expect(loaded.defaultTab).toBe("Au");
		expect(loaded.defaultCategoryOpen).toBe(true);
	});
});
