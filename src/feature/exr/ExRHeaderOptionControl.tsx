import { OptionSliderControl } from "@/components/blocks/OptionSliderControl";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import { getUniqueOptionId } from "@/logics/optionUtils";
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

	return (
		<OptionSliderControl
			label={label}
			values={values}
			selection={currentSelection}
			onChange={handleSelectionChange}
			disabled={false}
		/>
	);
}
