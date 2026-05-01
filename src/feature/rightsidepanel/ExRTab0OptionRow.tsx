import { ColoredText } from "../../components/parts/ColoredText";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { useExROptionActive } from "../../hooks/useExROptionActive";
import { useOptionData } from "../../hooks/useOptionData";
import { exrOptionMetaData } from "../../logics/api";
import { parseUniqueOptionId } from "../../logics/optionUtils";
import type { UniqueOptionId } from "../../type";
import { ExRTab0OptionValue } from "./ExRTab0OptionValue";

interface ExRTab0OptionRowProps {
	uniqueOptionId: UniqueOptionId;
}

/**
 * ExR各設定項目の行コンポーネント
 */
export function ExRTab0OptionRow({ uniqueOptionId }: ExRTab0OptionRowProps) {
	const optionData = useOptionData(uniqueOptionId);
	const isActive = useExROptionActive(uniqueOptionId);
	const { navigateToExROption } = useExRNavigation();

	const meta = exrOptionMetaData.options[uniqueOptionId]?.metaData;

	if (!meta || !isActive || !optionData) {
		return null;
	}

	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
	const selection = optionData.selection ?? 0;
	const value = optionData.values[selection] ?? 0;

	return (
		<ViewerOptionRow
			title={<ColoredText text={meta.translatedName} />}
			value={<ExRTab0OptionValue value={value} format={meta.format} />}
			onDoubleClick={() => {
				navigateToExROption(tabId, categoryId, uniqueOptionId);
			}}
		/>
	);
}
