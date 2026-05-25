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
import { AuOptionSummaryRow } from "./AuOptionSummaryRow";
import { ExRMinMaxSummaryRow } from "./ExRMinMaxSummaryRow";
import { PresetSummaryRow } from "./PresetSummaryRow";
import { VanillaRoleSummaryRow } from "./VanillaRoleSummaryRow";

/**
 * 右パネルの上部に表示される、主要な設定のサマリー項目
 */
export function RightSidePanelSummary() {
	return (
		<div
			className="flex flex-col gap-1 p-3 border-b border-gray-200 bg-gray-50"
			data-testid="right-panel-summary"
		>
			<PresetSummaryRow />
			<AuOptionSummaryRow
				optionId={AU_MAP_OPTION_ID}
				fallbackTitle="マップ"
				tabId={0}
				categoryId={0}
			/>
			<AuOptionSummaryRow
				optionId={AU_KILL_COOLDOWN_OPTION_ID}
				fallbackTitle="キルのクールダウン時間"
				tabId={0}
				categoryId={1}
			/>
			<AuOptionSummaryRow
				optionId={AU_IMPOSTOR_COUNT_OPTION_ID}
				fallbackTitle="インポスター人数"
				tabId={0}
				categoryId={1}
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_LIBERAL_MIN_ID}
				maxUniqueId={EXR_LIBERAL_MAX_ID}
				fallbackTitle="リベラル人数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_MILITANT_MIN_ID}
				maxUniqueId={EXR_MILITANT_MAX_ID}
				fallbackTitle="ミリタント"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_CREW_MIN_ID}
				maxUniqueId={EXR_CREW_MAX_ID}
				fallbackTitle="クルー陣営役職数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_IMPOSTOR_MIN_ID}
				maxUniqueId={EXR_IMPOSTOR_MAX_ID}
				fallbackTitle="インポスター陣営役職数"
			/>
			<ExRMinMaxSummaryRow
				minUniqueId={EXR_NEUTRAL_MIN_ID}
				maxUniqueId={EXR_NEUTRAL_MAX_ID}
				fallbackTitle="ニュートラル陣営役職数"
			/>
			{VANILLA_ROLE_CATEGORY_IDS.map((catId) => (
				<VanillaRoleSummaryRow key={catId} categoryId={catId} />
			))}
		</div>
	);
}
