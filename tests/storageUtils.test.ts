import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	loadAppSetting,
	loadPresetNamesFromLocalStorage,
	loadRightSidebarState,
	loadSidebarState,
	saveAppSetting,
	savePresetNamesToLocalStorage,
	saveRightSidebarState,
	saveSidebarState,
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

	describe("AppSetting", () => {
		it("should save and load app settings correctly", () => {
			const setting = {
				leftSidebar: { initialOpen: false, saveState: false },
				rightSidebar: { initialOpen: true, saveState: false },
			};
			saveAppSetting(setting);
			expect(loadAppSetting()).toEqual(setting);
		});

		it("should return default settings if nothing is stored", () => {
			const defaultSetting = {
				leftSidebar: { initialOpen: true, saveState: true },
				rightSidebar: { initialOpen: false, saveState: true },
			};
			expect(loadAppSetting()).toEqual(defaultSetting);
		});
	});

	describe("Sidebar State with Settings", () => {
		it("should use initialOpen setting when saveState is false (left)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: false, saveState: false },
				rightSidebar: { initialOpen: false, saveState: true },
			});
			// ブラウザには 'true' が保存されていても、saveState が false なら初期値を使う
			window.localStorage.setItem("sidebar_state", "true");
			expect(loadSidebarState()).toBe(false);
		});

		it("should use stored state when saveState is true (left)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: false, saveState: true },
				rightSidebar: { initialOpen: false, saveState: true },
			});
			window.localStorage.setItem("sidebar_state", "true");
			expect(loadSidebarState()).toBe(true);
		});

		it("should NOT save to localStorage when saveState is false (left)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: true, saveState: false },
				rightSidebar: { initialOpen: false, saveState: true },
			});
			saveSidebarState(false);
			expect(window.localStorage.getItem("sidebar_state")).toBeNull();
		});

		it("should use initialOpen setting when saveState is false (right)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: true, saveState: true },
				rightSidebar: { initialOpen: true, saveState: false },
			});
			window.localStorage.setItem("right_sidebar_state", "false");
			expect(loadRightSidebarState()).toBe(true);
		});

		it("should use stored state when saveState is true (right)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: true, saveState: true },
				rightSidebar: { initialOpen: true, saveState: true },
			});
			window.localStorage.setItem("right_sidebar_state", "true");
			expect(loadRightSidebarState()).toBe(true);
		});

		it("should NOT save to localStorage when saveState is false (right)", () => {
			saveAppSetting({
				leftSidebar: { initialOpen: true, saveState: true },
				rightSidebar: { initialOpen: true, saveState: false },
			});
			saveRightSidebarState(true);
			expect(window.localStorage.getItem("right_sidebar_state")).toBeNull();
		});
	});
});
