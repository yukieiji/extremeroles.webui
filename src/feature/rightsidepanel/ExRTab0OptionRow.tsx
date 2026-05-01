import { ColoredText } from "../../components/parts/ColoredText";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { parseUniqueOptionId } from "../../logics/optionUtils";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { ExRTab0OptionValue } from "./ExRTab0OptionValue";

interface ExRTab0OptionRowProps {
	uniqueOptionId: UniqueOptionId;
}

/**
 * ExR各設定項目の行コンポーネント
 */
export function ExRTab0OptionRow({ uniqueOptionId }: ExRTab0OptionRowProps) {
	const selection = useStore((state) => {
		return state.exrValue[uniqueOptionId]?.selection ?? 0;
	});
	const isActive = useStore((state) => {
		return state.isExROptionActive[uniqueOptionId];
	});
	const { navigateToExROption } = useExRNavigation();

	const optionMeta = exrOptionMetaData.options[uniqueOptionId]?.metaData;
	const values = exrOptionMetaData.options[uniqueOptionId]
		? useStore.getState().exrValue[uniqueOptionId]?.values
		: null;

	if (!optionMeta || !isActive || !values) {
		return null;
	}

	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
	const value = values[selection] ?? 0;

	return (
		<ViewerOptionRow
			title={<ColoredText text={optionMeta.translatedName} />}
			value={<ExRTab0OptionValue value={value} format={optionMeta.format} />}
			onDoubleClick={() => {
				navigateToExROption(tabId, categoryId, uniqueOptionId);
			}}
		/>
	);
}
