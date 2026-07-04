import { BaseSelectionSliderLayout } from "@/components/parts/BaseSelectionSliderLayout";
import { useBaseSelectionSlider } from "@/hooks/useBaseSelectionSlider";

interface SimulationSliderControlProps {
	label: string;
	value: number;
	min: number;
	max: number;
	onValueChange: (value: number) => void;
}

/**
 * シミュレーション設定用のスライダーコントロール
 */
export function SimulationSliderControl({
	label,
	value,
	min,
	max,
	onValueChange,
}: SimulationSliderControlProps) {
	const commitValue = () => {
		if (!inputRef.current) {
			return;
		}
		let val = parseFloat(inputRef.current.value);
		if (Number.isNaN(val)) {
			inputRef.current.value = value.toString();
			return;
		}

		// 範囲内にクランプ
		val = Math.max(min, Math.min(max, Math.round(val)));
		inputRef.current.value = val.toString();
		onValueChange(val);
	};

	const { id, inputRef, handleBlur, handleKeyDown, stopPropagation } =
		useBaseSelectionSlider(value, commitValue);

	const handleSliderChange = (val: number | readonly number[]) => {
		const newValue = Array.isArray(val) ? val[0] : val;
		onValueChange(newValue);
	};

	return (
		<BaseSelectionSliderLayout
			id={id}
			inputRef={inputRef}
			currentValue={value}
			sliderMin={min}
			sliderMax={max}
			sliderValue={value}
			onSliderChange={handleSliderChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			stopPropagation={stopPropagation}
			label={label}
		/>
	);
}
