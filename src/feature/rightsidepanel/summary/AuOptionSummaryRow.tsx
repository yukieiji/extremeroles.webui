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
	tabId: number;
	categoryId: number;
}

export function AuOptionSummaryRow({
	optionId,
	fallbackTitle,
	tabId,
	categoryId,
}: AuOptionSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const value = useStore((state) => {
		const selection = state.auValue[optionId] ?? 0;
		return String(auOptionMetaData.options[optionId]?.range[selection] ?? "");
	});

	const title = useMemo(
		() => auOptionMetaData.options[optionId]?.title ?? fallbackTitle,
		[optionId, fallbackTitle],
	);

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={value}
			onDoubleClick={() => navigateAu(tabId, categoryId, optionId)}
		/>
	);
}
