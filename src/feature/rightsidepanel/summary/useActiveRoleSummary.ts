import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { auOptionMetaData, exrOptionMetaData } from "@/logics/api";
import {
	getUniqueOptionId,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import {
	type AuOptionId,
	ExRTabId,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "@/type";
import { useStore } from "@/useStore";

const EXR_ROLE_TAB_IDS = [
	ExRTabId.CrewmateTab,
	ExRTabId.ImpostorTab,
	ExRTabId.NeutralTab,
	ExRTabId.CombinationTab,
	ExRTabId.GhostCrewmateTab,
	ExRTabId.GhostImpostorTab,
	ExRTabId.GhostNeutralTab,
];

const selectActiveVanillaCategories = (
	state: ReturnType<typeof useStore.getState>,
) => {
	return VANILLA_ROLE_CATEGORY_IDS.filter((catId) => {
		const catMeta = auOptionMetaData.categoryMetaData[catId];
		if (!catMeta) {
			return false;
		}
		const chanceId = catMeta.options[0] as AuOptionId;
		const maxCountId = catMeta.options[1] as AuOptionId;
		const chanceMeta = auOptionMetaData.options[chanceId];
		const maxCountMeta = auOptionMetaData.options[maxCountId];

		const chance = chanceMeta?.range[state.auValue[chanceId] ?? 0] ?? 0;
		const maxCount = maxCountMeta?.range[state.auValue[maxCountId] ?? 0] ?? 0;

		return Number(chance) !== 0 && Number(maxCount) !== 0;
	});
};

const selectActiveExRCategories = (
	state: ReturnType<typeof useStore.getState>,
) => {
	return EXR_ROLE_TAB_IDS.flatMap((tabId) => {
		const categoryIds = exrOptionMetaData.tabs[tabId]?.categoryIds ?? [];
		return categoryIds.filter((catId) => {
			const catMeta = exrOptionMetaData.categories[catId];
			if (!catMeta) {
				return false;
			}

			const chanceId = getUniqueOptionId(
				catMeta.tabId,
				catId,
				SPAWN_RATE_OPTION_ID,
			);
			const maxCountId = getUniqueOptionId(
				catMeta.tabId,
				catId,
				SPAWN_COUNT_OPTION_ID,
			);

			const chanceValueData = state.exrValue[chanceId];
			const maxCountValueData = state.exrValue[maxCountId];

			if (!chanceValueData || !maxCountValueData) {
				return false;
			}

			const chance = chanceValueData.values[chanceValueData.selection] ?? 0;
			const maxCount =
				maxCountValueData.values[maxCountValueData.selection] ?? 0;

			return Number(chance) !== 0 && Number(maxCount) !== 0;
		});
	});
};

/**
 * サマリーに表示すべき有効なVanilla役職とExR役職のカテゴリーIDリストを取得するカスタムフック
 */
export function useActiveRoleSummary() {
	const activeVanillaCategories = useStore(
		useShallow(selectActiveVanillaCategories),
	);
	const activeExRCategories = useStore(useShallow(selectActiveExRCategories));

	return useMemo(
		() => ({
			activeVanillaCategories,
			activeExRCategories,
		}),
		[activeVanillaCategories, activeExRCategories],
	);
}
