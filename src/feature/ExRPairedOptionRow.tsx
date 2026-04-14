import { OptionPairedSliderControl } from "../components/blocks/OptionPairedSliderControl";
import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { getUniqueOptionId } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";

interface ExRPairedOptionRowProps {
	categoryId: number;
	baseName: string;
	min: ExROptionDto;
	max: ExROptionDto;
	minLabel: string;
	maxLabel: string;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionRow({
	categoryId,
	baseName,
	min,
	max,
	minLabel,
	maxLabel,
}: ExRPairedOptionRowProps) {
	const minSelection = min.Selection;
	const maxSelection = max.Selection;

	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const handleMinChange = (newSelection: number) => {
		const uniqueId = getUniqueOptionId(categoryId, min.Id);
		TEMP_updateExROptionSelection(uniqueId, newSelection);
	};

	const handleMaxChange = (newSelection: number) => {
		const uniqueId = getUniqueOptionId(categoryId, max.Id);
		TEMP_updateExROptionSelection(uniqueId, newSelection);
	};

	const content = (
		<OptionItem className="min-h-[4.5rem]">
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 break-words">
					<OptionNameDisplay name={baseName} />
				</span>
			</div>
			<div className="flex-shrink-0 flex items-center gap-2">
				<OptionPairedSliderControl
					minSelection={minSelection}
					maxSelection={maxSelection}
					minValues={min.RangeMeta.Values as number[]}
					maxValues={max.RangeMeta.Values as number[]}
					format={min.Format}
					onMinChange={handleMinChange}
					onMaxChange={handleMaxChange}
					minLabel={minLabel}
					maxLabel={maxLabel}
				/>
			</div>
		</OptionItem>
	);

	return (
		<OptionRowContainer
			leading={<span className="text-gray-500 select-none text-xs">・</span>}
			content={content}
		/>
	);
}
