import { OptionPairedSliderControl } from "@/components/blocks/OptionPairedSliderControl";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { OptionItem } from "@/components/parts/OptionItem";
import { OptionNameDisplay } from "@/components/parts/OptionNameDisplay";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import type { OptionData } from "@/type";
import { useStore } from "@/useStore";

interface ExRPairedOptionItemProps {
	baseName: string;
	minData: OptionData;
	maxData: OptionData;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionItem({
	baseName,
	minData,
	maxData,
}: ExRPairedOptionItemProps) {
	const minUniqueOptionId = minData.uniqueOptionId;
	const maxUniqueOptionId = maxData.uniqueOptionId;
	const minValueData = useOptionData(minUniqueOptionId);
	const maxValueData = useOptionData(maxUniqueOptionId);

	const updateExROptionSelection = useUpdateExROptionSelection();

	const handleMinChange = async (newSelection: number) => {
		await updateExROptionSelection({
			uniqueOptionId: minUniqueOptionId,
			selection: newSelection,
		});
	};

	const handleMaxChange = async (newSelection: number) => {
		await updateExROptionSelection({
			uniqueOptionId: maxUniqueOptionId,
			selection: newSelection,
		});
	};

	const highlightedExROptionId = useStore(
		(state) => state.highlightedExROptionId,
	);
	const isMinHighlighted = highlightedExROptionId === minUniqueOptionId;
	const isMaxHighlighted = highlightedExROptionId === maxUniqueOptionId;
	const isHighlighted = isMinHighlighted || isMaxHighlighted;

	const navigateId = isMaxHighlighted
		? createExRNavigateId(maxUniqueOptionId)
		: createExRNavigateId(minUniqueOptionId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={true}
		>
			<OptionItem className="min-h-18">
				<div className="flex-1 min-w-0">
					<span className="text-sm font-medium text-gray-200 wrap-break-words">
						<OptionNameDisplay name={baseName} />
					</span>
				</div>
				<div className="shrink-0 flex items-center gap-2">
					<OptionPairedSliderControl
						minSelection={minValueData.selection}
						maxSelection={maxValueData.selection}
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
		</HighlightWrapper>
	);
}
