import type {
	AuRoleOption,
	UpdateAuArg,
	UpdatedOptions,
	UpdateExRArg,
} from "../type";
import { OptionValueType } from "../type";
import { useStore } from "../useStore";
import {
	auOptionMetaData,
	createAuOptionMetaData,
	createExROptionMetaData,
	fetchLobbyInfo,
	fetchRoleFilterData,
	fetchTranslationMetaData,
	globalSearchItems,
	updateAuOption,
	updateExrOption,
} from "./api";
import { parseAuOptionId, parseUniqueOptionId } from "./optionUtils";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let allOptionsPromise: Promise<void> | null = null;
let lobbyInfoPromise: Promise<void> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	allOptionsPromise = null;
	lobbyInfoPromise = null;
}

/**
 * ロビー情報のキャッシュをリセットする
 */
export function resetLobbyInfoCache() {
	lobbyInfoPromise = null;
}

async function waitDelay(): Promise<void> {
	const delay =
		typeof window !== "undefined"
			? (window as unknown as { __API_DELAY__?: number }).__API_DELAY__ || 0
			: 0;
	if (delay <= 0) {
		return;
	}
	await new Promise((resolve) => {
		return setTimeout(resolve, delay);
	});
}

async function createExROptionMetaDataWithStore(): Promise<void> {
	await waitDelay();

	const { valueData, isOptionActive } = await createExROptionMetaData();
	useStore.getState().setExROptions(valueData, isOptionActive);
}

export function useUpdateExROptionSelection(): (
	...updateInfos: UpdateExRArg[]
) => Promise<void> {
	const storeUpdate = useStore((state) => state.updateExROption);

	return async (...updateInfos: UpdateExRArg[]) => {
		console.log(
			JSON.stringify({
				type: "user_action",
				action: "updateExROption",
				payload: updateInfos,
			}),
		);
		const updateResult: (UpdatedOptions | null)[] = [];
		try {
			for (const info of updateInfos) {
				const { tabId, categoryId, optionId } = parseUniqueOptionId(
					info.uniqueOptionId,
				);
				const result = await updateExrOption(
					tabId,
					categoryId,
					optionId,
					info.selection,
				);
				updateResult.push(result);
			}
		} catch (error) {
			console.error("Error updating ExR option:", error);
			return;
		}

		storeUpdate(updateResult);
	};
}

async function createAuOptionMetaDataWithStore(): Promise<void> {
	await waitDelay();
	const initialValueData = await createAuOptionMetaData();
	useStore.getState().setAuValue(initialValueData);
}

async function fetchRoleFilterDataWithStore(): Promise<void> {
	await waitDelay();
	const data = await fetchRoleFilterData();
	useStore.getState().setRoleFilterSet(data);
}

export function useUpdateAuOptionSelection(): (
	updateInfo: UpdateAuArg,
) => Promise<void> {
	const auStoreUpdate = useStore((state) => state.updateAuOptionSelection);
	const exrStoreUpdate = useStore((state) => state.updateExROption);

	return async (updateInfo: UpdateAuArg) => {
		console.log(
			JSON.stringify({
				type: "user_action",
				action: "updateAuOption",
				payload: updateInfo,
			}),
		);
		const { optionName, valueType } = parseAuOptionId(updateInfo.auOptionId);
		const meta = auOptionMetaData.options[updateInfo.auOptionId];
		if (!meta) {
			return;
		}

		const newValue = meta.range[updateInfo.selection];
		let updateResult: UpdatedOptions;
		try {
			const updateNewValue =
				typeof newValue === "string" ? updateInfo.selection : newValue;

			updateResult = await updateAuOption({
				OptionName: optionName,
				ValueType: valueType as OptionValueType,
				NewValue: updateNewValue as number | boolean | AuRoleOption,
			});
		} catch (error) {
			console.error("Error updating Au option:", error);
			return;
		}
		auStoreUpdate(updateInfo);
		exrStoreUpdate([updateResult]);
	};
}

export function useUpdateAuRoleOptionSelection(): (
	chance: UpdateAuArg,
	maxCount: UpdateAuArg,
) => Promise<void> {
	const auStoreUpdate = useStore((state) => state.updateAuOptionSelection);
	const exrStoreUpdate = useStore((state) => state.updateExROption);

	return async (chance: UpdateAuArg, maxCount: UpdateAuArg) => {
		console.log(
			JSON.stringify({
				type: "user_action",
				action: "updateAuRoleOption",
				payload: { chance, maxCount },
			}),
		);
		const { optionName } = parseAuOptionId(chance.auOptionId);

		const chanceMeta = auOptionMetaData.options[chance.auOptionId];
		const maxCountMeta = auOptionMetaData.options[maxCount.auOptionId];

		if (!chanceMeta || !maxCountMeta) {
			return;
		}

		const chanceValue = chanceMeta.range[chance.selection] as number;
		const maxCountValue = maxCountMeta.range[maxCount.selection] as number;
		let updateResult: UpdatedOptions;
		try {
			updateResult = await updateAuOption({
				OptionName: optionName,
				ValueType: OptionValueType.RoleBase,
				NewValue: {
					Chance: chanceValue,
					MaxCount: maxCountValue,
				},
			});
		} catch (error) {
			console.error("Error updating Au option:", error);
			return;
		}
		auStoreUpdate(chance, maxCount);
		exrStoreUpdate([updateResult]);
	};
}

export async function refetchAll(): Promise<void> {
	globalSearchItems.length = 0;
	await fetchTranslationMetaData();
	await Promise.all([
		createExROptionMetaDataWithStore(),
		createAuOptionMetaDataWithStore(),
		fetchRoleFilterDataWithStore(),
	]);
}

export function getAllOptions(): Promise<void> {
	if (allOptionsPromise) {
		return allOptionsPromise;
	}
	allOptionsPromise = refetchAll();
	return allOptionsPromise;
}

export function getLobbyInfo(): Promise<void> {
	if (lobbyInfoPromise) {
		return lobbyInfoPromise;
	}
	lobbyInfoPromise = (async () => {
		await waitDelay();
		try {
			const info = await fetchLobbyInfo();
			const store = useStore.getState();
			store.setLobbyInfo(info);
			if (info.Online) {
				store.setSimulationPlayerNum(info.Online.MaxPlayerNum);
			} else {
				store.setSimulationPlayerNum(15);
			}
		} catch (error) {
			console.error("Failed to fetch lobby info:", error);
			const store = useStore.getState();
			store.setLobbyInfo(null);
			store.setSimulationPlayerNum(15);
			throw error;
		}
	})();
	return lobbyInfoPromise;
}
