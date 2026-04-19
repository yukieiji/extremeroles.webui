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
	const currentSelection = option.Selection ?? 0;
	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});

	const values = option.RangeMeta.Values as number[];

	const handleSelectionChange = (newSelection: number) => {
		updateExROptionSelection(uniqueId, newSelection);
	};

	const handleInputChange = (val: number) => {
		updateExROptionSelection(uniqueId, findClosestIndex(values, val));
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
