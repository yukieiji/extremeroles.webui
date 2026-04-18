import { CompactSlider } from "../components/parts/CompactSlider";
import { findClosestIndex, getUniqueOptionId } from "../logics/optionUtils";
import { useStore } from "../useStore";

interface ExRHeaderOptionControlProps {
	categoryId: number;
	optionId: number;
	label: string;
}

/**
 * カテゴリアコーディオンのヘッダーに表示するためのコンパクトなスライダーコントロール
 * (ストア接続済みラッパー)
 */
export function ExRHeaderOptionControl({
	categoryId,
	optionId,
	label,
}: ExRHeaderOptionControlProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, optionId);
	const valueData = useStore((state) => {
		return state.valueData[uniqueId];
	});
	const currentSelection = valueData?.selection ?? 0;
	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});

	const values = (valueData?.values as number[]) ?? [];

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
