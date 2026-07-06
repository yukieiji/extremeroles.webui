import { PresetNamesSchema } from "../type";

/**
 * LocalStorageのキー定義
 */
export const STORAGE_KEYS = {
	SIDEBAR_STATE: "sidebar_state",
	RIGHT_SIDEBAR_STATE: "right_sidebar_state",
	RIGHT_PANEL_WIDTH: "rightPanelWidth",
	PRESET_NAMES: "exr_preset_names",
} as const;

/**
 * LocalStorageに保存されるデータの型定義
 */
export interface LocalStorageData {
	[STORAGE_KEYS.SIDEBAR_STATE]: boolean;
	[STORAGE_KEYS.RIGHT_SIDEBAR_STATE]: boolean;
	[STORAGE_KEYS.RIGHT_PANEL_WIDTH]: number;
	[STORAGE_KEYS.PRESET_NAMES]: Record<number, string>;
}

/**
 * LocalStorageへのアクセサー（SSR考慮）
 */
const storage = {
	getItem: (key: string): string | null => {
		if (typeof window === "undefined" || !window.localStorage) {
			return null;
		}
		return window.localStorage.getItem(key);
	},
	setItem: (key: string, value: string): void => {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}
		try {
			window.localStorage.setItem(key, value);
		} catch (e) {
			console.error(`Failed to save ${key} to localStorage`, e);
		}
	},
};

/**
 * 左サイドバーの開閉状態を保存
 */
export function saveSidebarState(isOpen: boolean) {
	storage.setItem(STORAGE_KEYS.SIDEBAR_STATE, String(isOpen));
}

/**
 * 左サイドバーの開閉状態を読み込み
 */
export function loadSidebarState(defaultValue = true): boolean {
	const stored = storage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
	return stored !== null ? stored === "true" : defaultValue;
}

/**
 * 右サイドバーの開閉状態を保存
 */
export function saveRightSidebarState(isOpen: boolean) {
	storage.setItem(STORAGE_KEYS.RIGHT_SIDEBAR_STATE, String(isOpen));
}

/**
 * 右サイドバーの開閉状態を読み込み
 */
export function loadRightSidebarState(defaultValue = false): boolean {
	const stored = storage.getItem(STORAGE_KEYS.RIGHT_SIDEBAR_STATE);
	return stored !== null ? stored === "true" : defaultValue;
}

/**
 * 右パネルの幅を保存
 */
export function saveRightPanelWidth(width: number) {
	storage.setItem(STORAGE_KEYS.RIGHT_PANEL_WIDTH, String(width));
}

/**
 * 右パネルの幅を読み込み
 */
export function loadRightPanelWidth(defaultValue = 320): number {
	const stored = storage.getItem(STORAGE_KEYS.RIGHT_PANEL_WIDTH);
	if (stored === null) {
		return defaultValue;
	}
	const parsed = Number.parseInt(stored, 10);
	return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * プリセット名のリストをLocalStorageに保存する
 */
export function savePresetNamesToLocalStorage(names: Record<number, string>) {
	storage.setItem(STORAGE_KEYS.PRESET_NAMES, JSON.stringify(names));
}

/**
 * プリセット名のリストをLocalStorageから読み込む
 */
export function loadPresetNamesFromLocalStorage(): Record<number, string> {
	try {
		const value = storage.getItem(STORAGE_KEYS.PRESET_NAMES);
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
