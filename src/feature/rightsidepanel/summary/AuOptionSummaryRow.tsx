import { useMemo } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

interface AuOptionSummaryRowProps {
	optionId: AuOptionId;
	fallbackTitle?: string;
	tabId?: number;
	categoryId?: number;
}

export function AuOptionSummaryRow({
	optionId,
	fallbackTitle,
	tabId: propTabId,
	categoryId: propCategoryId,
}: AuOptionSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const value = useStore((state) => {
		const selection = state.auValue[optionId] ?? 0;
		return String(auOptionMetaData.options[optionId]?.range[selection] ?? "");
	});

	const meta = auOptionMetaData.options[optionId];
	const title = useMemo(
		() => meta?.title ?? fallbackTitle ?? "",
		[meta, fallbackTitle],
	);

	const tabId = propTabId ?? meta?.tabId ?? 0;
	const categoryId = propCategoryId ?? meta?.categoryId ?? 0;

	return (
		<ViewerOptionRow
			title={<ColoredText text={title} />}
			value={value}
			onDoubleClick={() => navigateAu(tabId, categoryId, optionId)}
		/>
	);
}
