import { useEffect, useRef } from "react";
import { findClosestIndex } from "@/logics/optionUtils";

interface UseOptionSliderProps {
	selection: number;
	values: number[];
	onChange: (selection: number) => void;
}

export function useOptionSlider({
	selection,
	values,
	onChange,
}: UseOptionSliderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const currentValue = values[selection] ?? values[0] ?? 0;

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = currentValue.toString();
		}
	}, [currentValue]);

	const handleSliderChange = (val: number | readonly number[]) => {
		const newIndex = Array.isArray(val) ? val[0] : val;
		onChange(newIndex);
	};

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

	const handleBlur = () => {
		commitValue();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	};

	return {
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
	};
}
