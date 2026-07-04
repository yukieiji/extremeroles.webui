import type React from "react";
import { useEffect, useId, useRef } from "react";
import { BaseSelectionSliderLayout } from "@/components/parts/BaseSelectionSliderLayout";

interface SimulationSliderControlProps {
	label: string;
	value: number;
	min: number;
	max: number;
	onValueChange: (value: number) => void;
}

/**
 * シミュレーション設定用のスライダーコントロール
 * シミュレーション専用のPropsを受け取ります
 */
export function SimulationSliderControl({
	label,
	value,
	min,
	max,
	onValueChange,
}: SimulationSliderControlProps) {
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = value.toString();
		}
	}, [value]);

	const handleSliderChange = (val: number | readonly number[]) => {
		const newValue = Array.isArray(val) ? val[0] : val;
		onValueChange(newValue);
	};

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

	const handleBlur = () => {
		commitValue();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	};

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
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
