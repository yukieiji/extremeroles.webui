import { Separator } from "@/components/ui/separator";
import { exrOptionMetaData } from "@/logics/api";
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
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import {
	AU_IMPOSTOR_COUNT_TITLE,
	AU_KILL_COOLDOWN_TITLE,
	AU_MAP_TITLE,
	EXR_CREW_ROLES_COUNT_TITLE,
	EXR_IMPOSTOR_ROLES_COUNT_TITLE,
	EXR_LIBERAL_COUNT_TITLE,
	EXR_MILITANT_COUNT_TITLE,
	EXR_NEUTRAL_ROLES_COUNT_TITLE,
} from "@/noTrans";
import { ExRTabId } from "@/type";
import { AuOptionSummaryRow } from "./AuOptionSummaryRow";
import { ExRMinMaxSummaryRow } from "./ExRMinMaxSummaryRow";
import { ExRRoleSummaryRow } from "./ExRRoleSummaryRow";
import { PresetSummaryRow } from "./PresetSummaryRow";
import { VanillaRoleSummaryRow } from "./VanillaRoleSummaryRow";

/**
 * 右パネルの上部に表示される、主要な設定のサマリー項目
 */
export function RightSidePanelSummary() {
	const exrRoleTabIds = [
		ExRTabId.CrewmateTab,
		ExRTabId.ImpostorTab,
		ExRTabId.NeutralTab,
		ExRTabId.CombinationTab,
		ExRTabId.GhostCrewmateTab,
		ExRTabId.GhostImpostorTab,
		ExRTabId.GhostNeutralTab,
	];

	return (
		<div
			className="flex py-2 flex-col border-b border-border-strong gap-1"
			data-testid="right-panel-summary"
		>
			<PresetSummaryRow />
			<AuOptionSummaryRow
				optionId={AU_MAP_OPTION_ID}
				fallbackTitle={AU_MAP_TITLE}
			/>
			<AuOptionSummaryRow
				optionId={AU_KILL_COOLDOWN_OPTION_ID}
				fallbackTitle={AU_KILL_COOLDOWN_TITLE}
			/>
			<Separator className="bg-border-strong" />
			<AuOptionSummaryRow
				optionId={AU_IMPOSTOR_COUNT_OPTION_ID}
				fallbackTitle={AU_IMPOSTOR_COUNT_TITLE}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_LIBERAL_MIN_ID}
				maxUniqueId={EXR_LIBERAL_MAX_ID}
				fallbackTitle={EXR_LIBERAL_COUNT_TITLE}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_MILITANT_MIN_ID}
				maxUniqueId={EXR_MILITANT_MAX_ID}
				fallbackTitle={EXR_MILITANT_COUNT_TITLE}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_CREW_MIN_ID}
				maxUniqueId={EXR_CREW_MAX_ID}
				fallbackTitle={EXR_CREW_ROLES_COUNT_TITLE}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_IMPOSTOR_MIN_ID}
				maxUniqueId={EXR_IMPOSTOR_MAX_ID}
				fallbackTitle={EXR_IMPOSTOR_ROLES_COUNT_TITLE}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_NEUTRAL_MIN_ID}
				maxUniqueId={EXR_NEUTRAL_MAX_ID}
				fallbackTitle={EXR_NEUTRAL_ROLES_COUNT_TITLE}
			/>
			<Separator className="bg-border-strong" />
			{VANILLA_ROLE_CATEGORY_IDS.map((catId) => (
				<VanillaRoleSummaryRow key={catId} categoryId={catId} />
			))}
			<Separator className="w-1/2 bg-border-weak" />
			{exrRoleTabIds.map((tabId) => {
				const categoryIds = exrOptionMetaData.tabs[tabId]?.categoryIds ?? [];
				return categoryIds.map((catId) => (
					<ExRRoleSummaryRow key={catId} categoryId={catId} />
				));
			})}
		</div>
	);
}
