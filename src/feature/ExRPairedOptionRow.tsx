import { OptionPairedSliderControl } from "../components/blocks/OptionPairedSliderControl";
import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { useOptionData } from "../logics/optionUtils";
import type { OptionData } from "../type";
import { useStore } from "../useStore";

interface ExRPairedOptionRowProps {
	baseName: string;
	minData: OptionData;
	maxData: OptionData;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionRow({
	baseName,
	minData,
	maxData,
}: ExRPairedOptionRowProps) {
	const minUniqueOptionId = minData.uniqueOptionId;
	const maxUniqueOptionId = maxData.uniqueOptionId;

	const effectiveMinSelection = useStore((state) => {
		return state.effectiveSelections[minUniqueOptionId];
	});
	const effectiveMaxSelection = useStore((state) => {
		return state.effectiveSelections[maxUniqueOptionId];
	});

	const minValueData = useOptionData(minUniqueOptionId);
	const maxValueData = useOptionData(maxUniqueOptionId);

	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const minSelection = effectiveMinSelection ?? minValueData.selection;
	const maxSelection = effectiveMaxSelection ?? maxValueData.selection;

	const handleMinChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(minUniqueOptionId, newSelection);
	};

	const handleMaxChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(maxUniqueOptionId, newSelection);
	};

	const content = (
		<OptionItem className="min-h-18">
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 wrap-break-words">
					<OptionNameDisplay name={baseName} />
				</span>
			</div>
			<div className="shrink-0 flex items-center gap-2">
				<OptionPairedSliderControl
					minSelection={minSelection}
					maxSelection={maxSelection}
					minValues={minValueData.values as number[]}
					maxValues={maxValueData.values as number[]}
					format={minData.metaData.format}
					onMinChange={handleMinChange}
					onMaxChange={handleMaxChange}
					minLabel={minData.label}
					maxLabel={maxData.label}
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
