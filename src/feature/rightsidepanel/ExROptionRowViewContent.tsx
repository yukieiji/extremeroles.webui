import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useExRNavigation } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { parseUniqueOptionId } from "@/logics/optionUtils";
import type { ExRTabId, UniqueOptionId } from "@/type";
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
	const navigateToExR = useExRNavigation();
	const navigate = () => {
		const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
		navigateToExR(tabId as ExRTabId, categoryId, uniqueOptionId);
	};

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
