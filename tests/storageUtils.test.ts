import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	loadPresetNamesFromLocalStorage,
	savePresetNamesToLocalStorage,
} from "@/logics/storageUtils";

describe("storageUtils", () => {
	beforeEach(() => {
		// LocalStorageをクリア
		window.localStorage.clear();
		vi.clearAllMocks();
	});

	it("should save and load preset names correctly from LocalStorage", () => {
		const names = { 0: "Default", 5: "Pro Mode" };
		savePresetNamesToLocalStorage(names);

		const loaded = loadPresetNamesFromLocalStorage();
		expect(loaded).toEqual(names);
	});

	it("should return empty object if LocalStorage item is missing", () => {
		const loaded = loadPresetNamesFromLocalStorage();
		expect(loaded).toEqual({});
	});

	it("should handle corrupted LocalStorage data by returning empty object", () => {
		window.localStorage.setItem("exr_preset_names", "invalid-json");
		const loaded = loadPresetNamesFromLocalStorage();
		expect(loaded).toEqual({});
	});

	it("should handle schema mismatch by returning empty object", () => {
		// 値が文字列ではない場合
		window.localStorage.setItem("exr_preset_names", JSON.stringify({ 0: 123 }));
		const loaded = loadPresetNamesFromLocalStorage();
		expect(loaded).toEqual({});
	});
});
