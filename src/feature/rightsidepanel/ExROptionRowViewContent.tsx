import { ColoredText } from "../../components/parts/ColoredText";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useOptionNavigation";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { ExRValueView } from "./ExRValueView";

interface ExROptionRowViewContentProps {
	uniqueOptionId: UniqueOptionId;
}

/**
 * 各設定項目の行コンポーネント
 */
export function ExROptionRowViewContent({
	uniqueOptionId,
}: ExROptionRowViewContentProps) {
	const optionData = exrOptionMetaData.options[uniqueOptionId]?.metaData;
	const navigate = useExRNavigation(uniqueOptionId);

	if (!optionData) {
		return null;
	}

	return (
		<ViewerOptionRow
			title={<ColoredText text={optionData.translatedName} />}
			value={
				<ExRValueView
					uniqueOptionId={uniqueOptionId}
					format={optionData.format}
				/>
			}
			onDoubleClick={navigate}
		/>
	);
}
