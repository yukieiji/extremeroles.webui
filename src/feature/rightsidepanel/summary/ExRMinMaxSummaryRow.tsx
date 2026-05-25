import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useExROptionNavigationInline } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { getBaseOptionName } from "@/logics/optionUtils";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

interface ExRMinMaxSummaryRowProps {
	minUniqueId: UniqueOptionId;
	maxUniqueId: UniqueOptionId;
	fallbackTitle: string;
}

export function ExRMinMaxSummaryRow({
	minUniqueId,
	maxUniqueId,
	fallbackTitle,
}: ExRMinMaxSummaryRowProps) {
	const navigateExR = useExROptionNavigationInline();
	const display = useStore(
		useShallow((state) => {
			const minOption = state.exrValue[minUniqueId];
			const maxOption = state.exrValue[maxUniqueId];
			const minVal = minOption?.values[minOption?.selection ?? 0] ?? 0;
			const maxVal = maxOption?.values[maxOption?.selection ?? 0] ?? 0;
			return `${minVal} - ${maxVal}`;
		}),
	);

	const title = useMemo(() => {
		const minMeta = exrOptionMetaData.options[minUniqueId]?.metaData;
		return minMeta ? getBaseOptionName(minMeta.translatedName) : fallbackTitle;
	}, [minUniqueId, fallbackTitle]);

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={display}
			onDoubleClick={() => navigateExR(minUniqueId)}
		/>
	);
}
