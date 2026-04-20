import { useStore } from "../useStore";
import { getAuOptions, getExrOptions, resetApiCache } from "./api.store";

/**
 * 全データの再取得と同期を行う
 * App.tsxなどのコンポーネントから呼び出されることを想定しています
 */
export async function performGlobalSync() {
	const validateOpenedIds = useStore.getState().validateOpenedIds;

	resetApiCache();
	await Promise.all([getExrOptions(), getAuOptions()]);
	validateOpenedIds();
}
