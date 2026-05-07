import {
	type SelectedTab,
	SelectedTabSchema,
} from "../slices/optionGroupToggleSidebarSlice";
import { PresetNamesSchema } from "../type";

const PRESET_NAMES_STORAGE_KEY = "exr_preset_names";
const APP_SETTINGS_STORAGE_KEY = "app_settings";

export interface AppSettings {
	defaultTab: SelectedTab;
	defaultCategoryOpen: boolean;
}

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

/**
 * アプリ設定をLocalStorageに保存する
 */
export function saveAppSettingsToLocalStorage(settings: AppSettings) {
	if (typeof window === "undefined" || !window.localStorage) {
		return;
	}
	try {
		window.localStorage.setItem(
			APP_SETTINGS_STORAGE_KEY,
			JSON.stringify(settings),
		);
	} catch (e) {
		console.error("Failed to save app settings to local storage", e);
	}
}

/**
 * アプリ設定をLocalStorageから読み込む
 */
export function loadAppSettingsFromLocalStorage(): AppSettings {
	const defaultSettings: AppSettings = {
		defaultTab: "Au",
		defaultCategoryOpen: false,
	};
	if (typeof window === "undefined" || !window.localStorage) {
		return defaultSettings;
	}
	try {
		const value = window.localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
		if (!value) {
			return defaultSettings;
		}
		const parsed = JSON.parse(value);
		if (typeof parsed !== "object" || parsed === null) {
			return defaultSettings;
		}

		const defaultTab = SelectedTabSchema.safeParse(parsed.defaultTab).success
			? parsed.defaultTab
			: defaultSettings.defaultTab;
		const defaultCategoryOpen =
			typeof parsed.defaultCategoryOpen === "boolean"
				? parsed.defaultCategoryOpen
				: defaultSettings.defaultCategoryOpen;

		return {
			defaultTab,
			defaultCategoryOpen,
		};
	} catch (e) {
		console.error("Failed to access/parse local storage", e);
		return defaultSettings;
	}
}
