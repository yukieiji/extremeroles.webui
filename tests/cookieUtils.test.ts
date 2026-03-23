import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getCookie,
	loadPresetNamesFromCookie,
	savePresetNamesToCookie,
	setCookie,
} from "../src/logics/cookieUtils";

describe("cookieUtils", () => {
	beforeEach(() => {
		// クッキーをクリア
		document.cookie.split(";").forEach((c) => {
			const expiredCookie = `${c.replace(/^ +/, "").replace(/=.*/, "")}=;expires=${new Date().toUTCString()};path=/`;
			/* biome-ignore lint/suspicious/noDocumentCookie: cookie cleanup for testing. */
			document.cookie = expiredCookie;
		});
		vi.clearAllMocks();
	});

	it("should save and load preset names correctly", () => {
		const names = { 0: "Default", 5: "Pro Mode" };
		savePresetNamesToCookie(names);

		const loaded = loadPresetNamesFromCookie();
		expect(loaded).toEqual(names);
	});

	it("should return empty object if cookie is missing", () => {
		const loaded = loadPresetNamesFromCookie();
		expect(loaded).toEqual({});
	});

	it("should handle corrupted cookie data by returning empty object", () => {
		setCookie("exr_preset_names", "invalid-json");
		const loaded = loadPresetNamesFromCookie();
		expect(loaded).toEqual({});
	});

	it("should handle schema mismatch by returning empty object", () => {
		// 値が文字列ではない場合
		setCookie("exr_preset_names", JSON.stringify({ 0: 123 }));
		const loaded = loadPresetNamesFromCookie();
		expect(loaded).toEqual({});
	});

	it("should handle getCookie correctly", () => {
		setCookie("test_cookie", "test_value");
		expect(getCookie("test_cookie")).toBe("test_value");
		expect(getCookie("non_existent")).toBeNull();
	});
});
