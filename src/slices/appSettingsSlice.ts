import type { StateCreator } from "zustand";
import {
	loadAppSettingsFromLocalStorage,
	saveAppSettingsToLocalStorage,
} from "../logics/storageUtils";
import type { SelectedTab } from "./optionGroupToggleSidebarSlice";

/**
 * アプリケーション設定を管理するスライスのインターフェース
 */
export interface AppSettingsSlice {
	defaultTab: SelectedTab;
	defaultCategoryOpen: boolean;
	setDefaultTab: (tab: SelectedTab) => void;
	setDefaultCategoryOpen: (isOpen: boolean) => void;
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
		defaultTab: initialSettings.defaultTab,
		defaultCategoryOpen: initialSettings.defaultCategoryOpen,
		setDefaultTab: (tab: SelectedTab) => {
			set({ defaultTab: tab });
			saveAppSettingsToLocalStorage({
				defaultTab: tab,
				defaultCategoryOpen: get().defaultCategoryOpen,
			});
		},
		setDefaultCategoryOpen: (isOpen: boolean) => {
			set({ defaultCategoryOpen: isOpen });
			saveAppSettingsToLocalStorage({
				defaultTab: get().defaultTab,
				defaultCategoryOpen: isOpen,
			});
		},
	};
};
