import { useStore } from "../useStore";
import { createAuOptionMetaData, createExROptionMetaData } from "./api";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let auOptionsPromise: Promise<void> | null = null;
let exrOptionsPromise: Promise<void> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	exrOptionsPromise = null;
	auOptionsPromise = null;
}

async function waitDelay(delay: number): Promise<void> {
	if (delay <= 0) {
		return;
	}
	await new Promise((resolve) => {
		return setTimeout(resolve, delay);
	});
}

async function createExROptionMetaDataWithStore(delay: number): Promise<void> {
	await waitDelay(delay);
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

async function createAuOptionMetaDataWithStore(delay: number): Promise<void> {
	await waitDelay(delay);
	const initialValueData = await createAuOptionMetaData();
	useStore.getState().setAuValue(initialValueData);
}

/**
 * Auオプションを取得する
 */
export function getAuOptions(): Promise<void> {
	if (auOptionsPromise) {
		return auOptionsPromise;
	}

	// @ts-expect-error - テスト用
	const delay = typeof window !== "undefined" ? window.__API_DELAY__ || 0 : 0;

	auOptionsPromise = createAuOptionMetaDataWithStore(delay);
	return auOptionsPromise;
}
