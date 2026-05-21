import { CompactSlider } from "@/components/parts/CompactSlider";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import { findClosestIndex, getUniqueOptionId } from "@/logics/optionUtils";
import type { ExROptionDto } from "@/type";
import { useStore } from "@/useStore";

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
	const updateExRSelection = useUpdateExROptionSelection();

	const values = option.RangeMeta.Values as number[];

	const handleSelectionChange = async (newSelection: number) => {
		await updateExRSelection({
			uniqueOptionId: uniqueId,
			selection: newSelection,
		});
	};

	const handleInputChange = async (val: number) => {
		await updateExRSelection({
			uniqueOptionId: uniqueId,
			selection: findClosestIndex(values, val),
		});
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
