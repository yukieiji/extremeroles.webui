import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useAuNavigation } from "../../hooks/useAuNavigation";
import { auOptionMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";
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
	const auValue = useStore((state) => {
		return state.auValue;
	});
	const { navigateToOption } = useAuNavigation();

	const optionMeta = auOptionMetaData.options[optionId];
	if (!optionMeta) {
		return null;
	}

	const selection = auValue[optionId] ?? 0;
	const value = optionMeta.range[selection];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={optionMeta.title}
				value={<AuTab0OptionValue value={value} format={optionMeta.format} />}
				onDoubleClick={() => {
					navigateToOption(0, categoryId, optionId);
				}}
				testId={`right-panel-option-${optionId}`}
			/>
		</div>
	);
}
