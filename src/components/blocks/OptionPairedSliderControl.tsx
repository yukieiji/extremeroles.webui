import { findClosestIndex } from "@/logics/optionUtils";
import { OptionSliderControl } from "./OptionSliderControl";

interface OptionPairedSliderControlProps {
	minSelection: number;
	maxSelection: number;
	minValues: number[];
	maxValues: number[];
	format: string;
	onMinChange: (selection: number) => void;
	onMaxChange: (selection: number) => void;
	minLabel: string;
	maxLabel: string;
	disabled?: boolean;
	minDisabled?: boolean;
	maxDisabled?: boolean;
}

/**
 * 最小・最大のペア設定用のスライダーコントロール
 */
export function OptionPairedSliderControl({
	minSelection,
	maxSelection,
	minValues,
	maxValues,
	format,
	onMinChange,
	onMaxChange,
	minLabel,
	maxLabel,
	disabled = false,
	minDisabled,
	maxDisabled,
}: OptionPairedSliderControlProps) {
	const handleMinChange = (newMinIdx: number) => {
		const newMinVal = minValues[newMinIdx];
		const currentMaxVal = maxValues[maxSelection];

		if (newMinVal > currentMaxVal) {
			// 最小が最大を超えた場合、最大を同じ値（またはそれに近い値）に調整
			onMaxChange(findClosestIndex(maxValues, newMinVal));
		}
		onMinChange(newMinIdx);
	};

	const handleMaxChange = (newMaxIdx: number) => {
		const newMaxVal = maxValues[newMaxIdx];
		const currentMinVal = minValues[minSelection];

		if (newMaxVal < currentMinVal) {
			// 最大が最小を下回った場合、最小を同じ値（またはそれに近い値）に調整
			onMinChange(findClosestIndex(minValues, newMaxVal));
		}
		onMaxChange(newMaxIdx);
	};

	return (
		<div className="flex flex-col gap-2 sm:flex-row items-center w-full sm:w-lg">
			<OptionSliderControl
				label={minLabel}
				selection={minSelection}
				values={minValues}
				format={format}
				onChange={handleMinChange}
				disabled={minDisabled ?? disabled}
			/>
			<OptionSliderControl
				label={maxLabel}
				selection={maxSelection}
				values={maxValues}
				format={format}
				onChange={handleMaxChange}
				disabled={maxDisabled ?? disabled}
			/>
		</div>
	);
}
