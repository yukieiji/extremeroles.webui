import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import {
	AU_MAP_OPTION_ID,
	EXR_RANDOM_MAP_OPTION_ID,
} from "@/logics/optionUtils";
import { RANDOM_MAP_LABEL } from "@/noTrans";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

interface AuOptionSummaryRowProps {
	optionId: AuOptionId;
	fallbackTitle: string;
}

export function AuOptionSummaryRow({
	optionId,
	fallbackTitle,
}: AuOptionSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const value = useStore((state) => {
		if (optionId === AU_MAP_OPTION_ID) {
			const randomMapSelection =
				state.exrValue[EXR_RANDOM_MAP_OPTION_ID]?.selection ?? 0;
			if (randomMapSelection === 1) {
				return RANDOM_MAP_LABEL;
			}
		}
		const selection = state.auValue[optionId] ?? 0;
		return String(auOptionMetaData.options[optionId]?.range[selection] ?? "");
	});

	const meta = auOptionMetaData.options[optionId];
	const title = meta?.title ?? fallbackTitle;

	if (!meta) {
		return null;
	}

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={value}
			onDoubleClick={() => navigateAu(meta.tabId, meta.categoryId, optionId)}
		/>
	);
}
