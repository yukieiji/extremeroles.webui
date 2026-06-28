import { Separator } from "@/components/ui/separator";
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
} from "@/logics/optionUtils";
import { AuOptionSummaryRow } from "./AuOptionSummaryRow";
import { ExRMinMaxSummaryRow } from "./ExRMinMaxSummaryRow";
import { PresetSummaryRow } from "./PresetSummaryRow";
import { RoleSummarySection } from "./RoleSummarySection";

/**
 * 右パネルの上部に表示される、主要な設定のサマリー項目
 */
export function RightSidePanelSummary() {
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
			<RoleSummarySection />
		</div>
	);
}
