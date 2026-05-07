import type { StateCreator } from "zustand";
import {
	type AppSettings,
	loadAppSettingsFromLocalStorage,
	saveAppSettingsToLocalStorage,
} from "../logics/storageUtils";

/**
 * アプリケーション設定を管理するスライスのインターフェース
 */
export interface AppSettingsSlice {
	appSettings: AppSettings;
	updateAppSettings: (patch: Partial<AppSettings>) => void;
}

/**
 * アプリケーション設定の状態管理を行うスライスの生成
 */
export const createAppSettingsSlice: StateCreator<AppSettingsSlice> = (
	set,
	get,
) => {
	const initialSettings = loadAppSettingsFromLocalStorage();

	return {
		appSettings: initialSettings,
		updateAppSettings: (patch: Partial<AppSettings>) => {
			const nextSettings = {
				...get().appSettings,
				...patch,
			};
			set({ appSettings: nextSettings });
			saveAppSettingsToLocalStorage(nextSettings);
		},
	};
};
