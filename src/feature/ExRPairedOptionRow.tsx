import { OptionPairedSliderControl } from "../components/blocks/OptionPairedSliderControl";
import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId } from "../logics/optionUtils";
import { useStore } from "../useStore";

interface ExRPairedOptionRowProps {
	categoryId: number;
	baseName: string;
	minOptionId: number;
	maxOptionId: number;
	minLabel: string;
	maxLabel: string;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionRow({
	categoryId,
	baseName,
	minOptionId,
	maxOptionId,
	minLabel,
	maxLabel,
}: ExRPairedOptionRowProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const minUniqueId = getUniqueOptionId(selectedExRTabId, categoryId, minOptionId);
	const maxUniqueId = getUniqueOptionId(selectedExRTabId, categoryId, maxOptionId);

	const minValueData = useStore((state) => {
		return state.valueData[minUniqueId];
	});
	const maxValueData = useStore((state) => {
		return state.valueData[maxUniqueId];
	});

	const minSelection = minValueData?.selection ?? 0;
	const maxSelection = maxValueData?.selection ?? 0;

	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});

	const handleMinChange = (newSelection: number) => {
		updateExROptionSelection(minUniqueId, newSelection);
	};

	const handleMaxChange = (newSelection: number) => {
		updateExROptionSelection(maxUniqueId, newSelection);
	};

	const minMeta = exrOptionMetaData.optionMetaData[minUniqueId];
	const maxMeta = exrOptionMetaData.optionMetaData[maxUniqueId];

	if (!minValueData || !maxValueData || !minMeta || !maxMeta) {
		return null;
	}

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
					minValues={minValueData.values as number[]}
					maxValues={maxValueData.values as number[]}
					format={minMeta.format}
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
