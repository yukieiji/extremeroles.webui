import { CompactSlider } from "../components/parts/CompactSlider";
import { findClosestIndex, getUniqueOptionId } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";

interface ExRHeaderOptionControlProps {
	categoryId: number;
	option: ExROptionDto;
	label: string;
}

/**
 * カテゴリアコーディオンのヘッダーに表示するためのコンパクトなスライダーコントロール
 * (ストア接続済みラッパー)
 */
export function ExRHeaderOptionControl({
	categoryId,
	option,
	label,
}: ExRHeaderOptionControlProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, option.Id);
	const effectiveSelection = useStore((state) => {
		return state.effectiveSelections[uniqueId];
	});
	const currentSelection = effectiveSelection ?? option.Selection;
	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const values = option.RangeMeta.Values as number[];

	const handleSelectionChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(uniqueId, newSelection);
	};

	const handleInputChange = (val: number) => {
		TEMP_updateExROptionSelection(uniqueId, findClosestIndex(values, val));
	};

	return (
		<CompactSlider
			label={label}
			values={values}
			currentSelection={currentSelection}
			onSelectionChange={handleSelectionChange}
			onInputChange={handleInputChange}
		/>
	);
}
