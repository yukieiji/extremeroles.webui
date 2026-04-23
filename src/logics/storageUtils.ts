import { PresetNamesSchema } from "../type";

const PRESET_NAMES_STORAGE_KEY = "exr_preset_names";

/**
 * プリセット名のリストをLocalStorageに保存する
 */
export function savePresetNamesToLocalStorage(names: Record<number, string>) {
	if (typeof window === "undefined" || !window.localStorage) {
		return;
	}
	try {
		window.localStorage.setItem(
			PRESET_NAMES_STORAGE_KEY,
			JSON.stringify(names),
		);
	} catch (e) {
		console.error("Failed to save preset names to local storage", e);
	}
}

/**
 * プリセット名のリストをLocalStorageから読み込む
 */
export function loadPresetNamesFromLocalStorage(): Record<number, string> {
	if (typeof window === "undefined" || !window.localStorage) {
		return {};
	}
	try {
		const value = window.localStorage.getItem(PRESET_NAMES_STORAGE_KEY);
		if (!value) {
			return {};
		}
		const parsed = JSON.parse(value);
		const result = PresetNamesSchema.safeParse(parsed);
		if (result.success) {
			return result.data;
		}
		console.error(
			"Failed to validate preset names from local storage",
			result.error,
		);
		return {};
	} catch (e) {
		console.error("Failed to access/parse local storage", e);
		return {};
	}
}
