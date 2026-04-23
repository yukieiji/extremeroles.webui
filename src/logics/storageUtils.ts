import { PresetNamesSchema } from "../type";

const PRESET_NAMES_STORAGE_KEY = "exr_preset_names";

/**
 * プリセット名のリストをLocalStorageに保存する
 */
export function savePresetNamesToLocalStorage(names: Record<number, string>) {
	if (typeof window === "undefined" || !window.localStorage) {
		return;
	}
	window.localStorage.setItem(PRESET_NAMES_STORAGE_KEY, JSON.stringify(names));
}

/**
 * プリセット名のリストをLocalStorageから読み込む
 */
export function loadPresetNamesFromLocalStorage(): Record<number, string> {
	if (typeof window === "undefined" || !window.localStorage) {
		return {};
	}
	const value = window.localStorage.getItem(PRESET_NAMES_STORAGE_KEY);
	if (!value) {
		return {};
	}
	try {
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
		console.error("Failed to parse preset names from local storage", e);
		return {};
	}
}
