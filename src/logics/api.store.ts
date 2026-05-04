import type {
	AuRoleOption,
	UpdateAuArg,
	UpdatedOptions,
	UpdateExRArg,
} from "../type";
import { OptionValueType, PostExRAssignOps } from "../type";
import { useStore } from "../useStore";
import {
	auOptionMetaData,
	createAuOptionMetaData,
	createExROptionMetaData,
	fetchRoleFilterData,
	fetchTranslationMetaData,
	postRoleFilterUpdate,
	roleFilterMetaData,
	updateAuOption,
	updateExrOption,
} from "./api";
import { parseAuOptionId, parseUniqueOptionId } from "./optionUtils";

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let allOptionsPromise: Promise<void> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
	allOptionsPromise = null;
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
		let updateResult: (UpdatedOptions | null)[];
		try {
			updateResult = await Promise.all(
				updateInfos.map(async (info) => {
					const { tabId, categoryId, optionId } = parseUniqueOptionId(
						info.uniqueOptionId,
					);
					const result = await updateExrOption(
						tabId,
						categoryId,
						optionId,
						info.selection,
					);
					return result;
				}),
			);
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

export async function handleAddRoleFilter(): Promise<void> {
	const guid = crypto.randomUUID();
	try {
		await postRoleFilterUpdate({
			Op: PostExRAssignOps.FilterNewAdd,
			FilterId: guid,
			MapRoleId: null,
		});
		useStore.getState().addRoleFilter(guid);
	} catch (error) {
		console.error("Failed to add role filter:", error);
	}
}

export async function handleDeleteRoleFilter(guid: string): Promise<void> {
	try {
		await postRoleFilterUpdate({
			Op: PostExRAssignOps.FilterDelete,
			FilterId: guid,
			MapRoleId: null,
		});
		useStore.getState().deleteRoleFilter(guid);
	} catch (error) {
		console.error("Failed to delete role filter:", error);
	}
}

export async function handleAddRoleToFilter(
	guid: string,
	roleId: number,
): Promise<void> {
	try {
		await postRoleFilterUpdate({
			Op: PostExRAssignOps.FilterRoleAdd,
			FilterId: guid,
			MapRoleId: roleId,
		});

		const roleName =
			(roleFilterMetaData.NormalRoleId[roleId] as string) ||
			(roleFilterMetaData.CombinationId[roleId] as string) ||
			(roleFilterMetaData.GhostRoleId[roleId] as string) ||
			"Unknown Role";

		useStore.getState().addRoleToFilter(guid, roleId, roleName);
	} catch (error) {
		console.error("Failed to add role to filter:", error);
	}
}

export async function handleRemoveRoleFromFilter(
	guid: string,
	roleId: number,
): Promise<void> {
	try {
		await postRoleFilterUpdate({
			Op: PostExRAssignOps.FilterRoleDelete,
			FilterId: guid,
			MapRoleId: roleId,
		});
		useStore.getState().removeRoleFromFilter(guid, roleId);
	} catch (error) {
		console.error("Failed to remove role from filter:", error);
	}
}

export function useUpdateAuRoleOptionSelection(): (
	chance: UpdateAuArg,
	maxCount: UpdateAuArg,
) => Promise<void> {
	const auStoreUpdate = useStore((state) => state.updateAuOptionSelection);
	const exrStoreUpdate = useStore((state) => state.updateExROption);

	return async (chance: UpdateAuArg, maxCount: UpdateAuArg) => {
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

export async function refechAll(): Promise<void> {
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
	allOptionsPromise = refechAll();
	return allOptionsPromise;
}
