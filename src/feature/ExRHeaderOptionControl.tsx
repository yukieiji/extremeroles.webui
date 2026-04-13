import { CompactSlider } from "../components/parts/CompactSlider";
import { findClosestIndex } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";

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
	const values = option.RangeMeta.Values as number[];

	const handleSelectionChange = (_newSelection: number) => {
		// PUTリクエストはまだ実装しない
	};

	const handleInputChange = (val: number) => {
		handleSelectionChange(findClosestIndex(values, val));
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
