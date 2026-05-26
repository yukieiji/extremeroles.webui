import { useMemo } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
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
		const selection = state.auValue[optionId] ?? 0;
		return String(auOptionMetaData.options[optionId]?.range[selection] ?? "");
	});

	const meta = auOptionMetaData.options[optionId];
	const title = useMemo(
		() => meta?.title ?? fallbackTitle,
		[meta, fallbackTitle],
	);

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
