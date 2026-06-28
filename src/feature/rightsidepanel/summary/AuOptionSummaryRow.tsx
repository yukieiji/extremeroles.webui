import { ColoredText } from "@/components/parts/ColoredText";
import { OptionFormat } from "@/components/parts/OptionFormat";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { TYPOGRAPHY } from "@/designConstants";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData, translationMetaData } from "@/logics/api";
import {
	AU_MAP_OPTION_ID,
	EXR_RANDOM_MAP_OPTION_ID,
} from "@/logics/optionUtils";
import { getMapName } from "@/noTrans";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

interface AuOptionSummaryRowProps {
	optionId: AuOptionId;
}

export function AuOptionSummaryRow({ optionId }: AuOptionSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const value = useStore((state) => {
		if (optionId === AU_MAP_OPTION_ID) {
			const randomMapSelection =
				state.exrValue[EXR_RANDOM_MAP_OPTION_ID]?.selection ?? 0;
			if (randomMapSelection === 1) {
				return translationMetaData.RANDOM_MAP_LABEL;
			}
		}
		const selection = state.auValue[optionId] ?? 0;
		const rawValue = auOptionMetaData.options[optionId]?.range[selection];
		if (optionId === AU_MAP_OPTION_ID) {
			return getMapName(Number(rawValue ?? 0));
		}
		return String(rawValue ?? "");
	});

	const meta = auOptionMetaData.options[optionId];
	const title = meta?.title ?? "ERROR_TITLE_MISS_AU";

	if (!meta) {
		return null;
	}

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} className={TYPOGRAPHY.CHILD_LABEL} />}
			value={
				<div className="flex items-end">
					{value}
					<OptionFormat format={meta?.format ?? ""} />
				</div>
			}
			onDoubleClick={() => navigateAu(meta.tabId, meta.categoryId, optionId)}
		/>
	);
}
