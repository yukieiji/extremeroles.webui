import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useAuNavigation } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";
import { AuTab0OptionValue } from "./AuTab0OptionValue";

interface AuTab0OptionRowProps {
	optionId: AuOptionId;
	categoryId: number;
}

/**
 * 各設定項目の行コンポーネント
 */
export function AuTab0OptionRow({
	optionId,
	categoryId,
}: AuTab0OptionRowProps) {
	const selection = useStore((state) => {
		return state.auValue[optionId] ?? 0;
	});
	const navigateToOption = useAuNavigation(0, categoryId, optionId);

	const optionMeta = auOptionMetaData.options[optionId];
	if (!optionMeta) {
		return null;
	}

	const value = optionMeta.range[selection] ?? 0;

	return (
		<ViewerOptionRow
			title={optionMeta.title}
			value={<AuTab0OptionValue value={value} format={optionMeta.format} />}
			onDoubleClick={navigateToOption}
		/>
	);
}
