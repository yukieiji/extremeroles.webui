import { DisabledControlTooltip } from "@/components/blocks/DisabledControlTooltip";
import { OptionPairedSliderControl } from "@/components/blocks/OptionPairedSliderControl";
import { ColoredText } from "@/components/parts/ColoredText";
import { OptionItem } from "@/components/parts/OptionItem";
import { TYPOGRAPHY } from "@/designConstants";
import { useOptionActive, useOptionData } from "@/hooks/useExROptionData";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import type { OptionData } from "@/type";
import { useStore } from "@/useStore";

interface ExRPairedOptionContentProps {
	baseName: string;
	minData: OptionData;
	maxData: OptionData;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionContent({
	baseName,
	minData,
	maxData,
}: ExRPairedOptionContentProps) {
	const minUniqueOptionId = minData.uniqueOptionId;
	const maxUniqueOptionId = maxData.uniqueOptionId;
	const minValueData = useOptionData(minUniqueOptionId);
	const maxValueData = useOptionData(maxUniqueOptionId);

	const isMinActive = useOptionActive(minUniqueOptionId);
	const isMaxActive = useOptionActive(maxUniqueOptionId);
	const inactiveOptionDisplay = useStore(
		(state) => state.appSetting?.inactiveOptionDisplay ?? "hidden",
	);
	const isDisabled =
		inactiveOptionDisplay === "disabled" && (!isMinActive || !isMaxActive);

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

	return (
		<OptionItem className="min-h-18">
			<div className="flex-1 min-w-0">
				<ColoredText
					text={baseName}
					className={`${TYPOGRAPHY.CHILD_LABEL} text-text-primary wrap-break-words`}
				/>
			</div>
			<div className="shrink-0 flex items-center">
				<DisabledControlTooltip disabled={isDisabled}>
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
						disabled={isDisabled}
					/>
				</DisabledControlTooltip>
			</div>
		</OptionItem>
	);
}
