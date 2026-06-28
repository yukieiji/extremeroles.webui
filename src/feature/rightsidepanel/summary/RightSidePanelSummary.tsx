import { useShallow } from "zustand/react/shallow";
import { Separator } from "@/components/ui/separator";
import { auOptionMetaData, exrOptionMetaData } from "@/logics/api";
import {
	AU_IMPOSTOR_COUNT_OPTION_ID,
	AU_KILL_COOLDOWN_OPTION_ID,
	AU_MAP_OPTION_ID,
	EXR_CREW_MAX_ID,
	EXR_CREW_MIN_ID,
	EXR_IMPOSTOR_MAX_ID,
	EXR_IMPOSTOR_MIN_ID,
	EXR_LIBERAL_MAX_ID,
	EXR_LIBERAL_MIN_ID,
	EXR_MILITANT_MAX_ID,
	EXR_MILITANT_MIN_ID,
	EXR_NEUTRAL_MAX_ID,
	EXR_NEUTRAL_MIN_ID,
	getUniqueOptionId,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import { ExRTabId, SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "@/type";
import { useStore } from "@/useStore";
import { AuOptionSummaryRow } from "./AuOptionSummaryRow";
import { ExRMinMaxSummaryRow } from "./ExRMinMaxSummaryRow";
import { ExRRoleSummaryRow } from "./ExRRoleSummaryRow";
import { PresetSummaryRow } from "./PresetSummaryRow";
import { VanillaRoleSummaryRow } from "./VanillaRoleSummaryRow";

const EXR_ROLE_TAB_IDS = [
	ExRTabId.CrewmateTab,
	ExRTabId.ImpostorTab,
	ExRTabId.NeutralTab,
	ExRTabId.CombinationTab,
	ExRTabId.GhostCrewmateTab,
	ExRTabId.GhostImpostorTab,
	ExRTabId.GhostNeutralTab,
];

/**
 * 右パネルの上部に表示される、主要な設定のサマリー項目
 */
export function RightSidePanelSummary() {
	const { hasVanillaRole, hasExRRole } = useStore(
		useShallow((state) => {
			const hasVanilla = VANILLA_ROLE_CATEGORY_IDS.some((categoryId) => {
				const catMeta = auOptionMetaData.categoryMetaData[categoryId];
				const chanceId = catMeta?.options[0];
				const maxCountId = catMeta?.options[1];
				if (chanceId === undefined || maxCountId === undefined) {
					return false;
				}
				const chanceMeta = auOptionMetaData.options[chanceId];
				const maxCountMeta = auOptionMetaData.options[maxCountId];

				const chance = chanceMeta?.range[state.auValue[chanceId] ?? 0] ?? 0;
				const maxCount =
					maxCountMeta?.range[state.auValue[maxCountId] ?? 0] ?? 0;

				return Number(chance) !== 0 && Number(maxCount) !== 0;
			});

			const hasExR = EXR_ROLE_TAB_IDS.some((tabId) => {
				const categoryIds = exrOptionMetaData.tabs[tabId]?.categoryIds ?? [];
				return categoryIds.some((categoryId) => {
					const catMeta = exrOptionMetaData.categories[categoryId];
					if (!catMeta) {
						return false;
					}

					const chanceId = getUniqueOptionId(
						catMeta.tabId,
						categoryId,
						SPAWN_RATE_OPTION_ID,
					);
					const maxCountId = getUniqueOptionId(
						catMeta.tabId,
						categoryId,
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

			return { hasVanillaRole: hasVanilla, hasExRRole: hasExR };
		}),
	);

	return (
		<div
			className="flex py-2 flex-col border-b border-border-strong gap-1"
			data-testid="right-panel-summary"
		>
			<PresetSummaryRow />
			<AuOptionSummaryRow optionId={AU_MAP_OPTION_ID} />
			<AuOptionSummaryRow optionId={AU_KILL_COOLDOWN_OPTION_ID} />
			<Separator className="bg-border-strong" />
			<AuOptionSummaryRow optionId={AU_IMPOSTOR_COUNT_OPTION_ID} />
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_LIBERAL_MIN_ID}
				maxUniqueId={EXR_LIBERAL_MAX_ID}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_MILITANT_MIN_ID}
				maxUniqueId={EXR_MILITANT_MAX_ID}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_CREW_MIN_ID}
				maxUniqueId={EXR_CREW_MAX_ID}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_IMPOSTOR_MIN_ID}
				maxUniqueId={EXR_IMPOSTOR_MAX_ID}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_NEUTRAL_MIN_ID}
				maxUniqueId={EXR_NEUTRAL_MAX_ID}
			/>
			<Separator className="bg-border-strong" />
			{VANILLA_ROLE_CATEGORY_IDS.map((catId) => (
				<VanillaRoleSummaryRow key={catId} categoryId={catId} />
			))}
			{hasVanillaRole && hasExRRole && (
				<Separator className="data-horizontal:w-4/5 mx-auto bg-border-weak" />
			)}
			{EXR_ROLE_TAB_IDS.map((tabId) => {
				const categoryIds = exrOptionMetaData.tabs[tabId]?.categoryIds ?? [];
				return categoryIds.map((catId) => (
					<ExRRoleSummaryRow key={catId} categoryId={catId} />
				));
			})}
		</div>
	);
}
