import type { AuOptionCategoryDto } from "../type";

import { useStore } from "../useStore";
import { AU_OPTION_URL, createExROptionMetaData } from "./api";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;
let exrOptionsPromise: Promise<void> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrOptionsPromise = null;
	auOptionsPromise = null;
}

async function createExROptionMetaDataWithStore(delay: number): Promise<void> {
	if (delay > 0) {
		await new Promise((resolve) => {
			return setTimeout(resolve, delay);
		});
	}
	const { valueData, isOptionActive } = await createExROptionMetaData();
	useStore.getState().setExROptions(valueData, isOptionActive);
}

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<void> {
	if (exrOptionsPromise) {
		return exrOptionsPromise;
	}
	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;
	exrOptionsPromise = createExROptionMetaDataWithStore(delay);
	return exrOptionsPromise;
}

/**
 * Auオプションを取得する
 */
export function getAuOptions(): Promise<AuOptionCategoryDto[]> {
	if (auOptionsPromise) {
		return auOptionsPromise;
	}

	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;

	auOptionsPromise = (async () => {
		if (delay > 0) {
			await new Promise((resolve) => {
				return setTimeout(resolve, delay);
			});
		}
		const res = await fetch(AU_OPTION_URL);
		if (!res.ok) {
			throw new Error(`Failed to fetch Au options: ${res.statusText}`);
		}
		return res.json();
	})();

	return auOptionsPromise;
}

/**
 * データを再取得して同期する
 */
export async function syncOptions(): Promise<void> {
	resetApiCache();
	await Promise.all([getExrOptions(), getAuOptions()]);
	useStore.getState().validateOpenedIds();
}
