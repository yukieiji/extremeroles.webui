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
	const currentSelection = option.Selection;
	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});
	const isPending = useStore((state) => {
		const uniqueId = getUniqueOptionId(categoryId, option.Id);
		return !!state.pendingExROptionIds[uniqueId];
	});

	const values = option.RangeMeta.Values as number[];

	const handleSelectionChange = (newSelection: number) => {
		updateExROptionSelection(categoryId, option.Id, newSelection);
	};

	const handleInputChange = (val: number) => {
		handleSelectionChange(findClosestIndex(values, val));
	};

	return (
		<div className={isPending ? "opacity-50 pointer-events-none" : ""}>
			<CompactSlider
				label={label}
				values={values}
				currentSelection={currentSelection}
				onSelectionChange={handleSelectionChange}
				onInputChange={handleInputChange}
			/>
		</div>
	);
}
