import { findClosestIndex } from "@/logics/optionUtils";
import { useBaseSelectionSlider } from "./useBaseSelectionSlider";

/**
 * オプション用のスライダーロジック
 */
export function useOptionSlider(
	selection: number,
	values: number[],
	onChange: (selection: number) => void,
) {
	const currentValue = values[selection] ?? values[0] ?? 0;

	const commitValue = () => {
		if (!inputRef.current) {
			return;
		}
		const val = parseFloat(inputRef.current.value);
		if (Number.isNaN(val)) {
			inputRef.current.value = currentValue.toString();
			return;
		}

		const closestIdx = findClosestIndex(values, val);
		inputRef.current.value = (values[closestIdx] ?? values[0] ?? 0).toString();
		onChange(closestIdx);
	};

	const { id, inputRef, handleBlur, handleKeyDown, stopPropagation } =
		useBaseSelectionSlider(currentValue, commitValue);

	const handleSliderChange = (val: number | readonly number[]) => {
		const newIndex = Array.isArray(val) ? val[0] : val;
		onChange(newIndex);
	};

	return {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
		stopPropagation,
	};
}
