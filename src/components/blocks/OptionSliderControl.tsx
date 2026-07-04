import type React from "react";
import { useEffect, useId, useRef } from "react";
import { findClosestIndex } from "@/logics/optionUtils";
import { BaseSelectionSliderLayout } from "../parts/BaseSelectionSliderLayout";
import { OptionFormat } from "../parts/OptionFormat";

interface OptionSliderControlProps {
	label?: string;
	selection: number;
	values: number[];
	format?: string;
	onChange: (selection: number) => void;
	testId?: string;
	className?: string;
	inputClassName?: string;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	label,
	selection,
	values,
	format,
	onChange,
	testId,
	className,
	inputClassName,
}: OptionSliderControlProps) {
	const id = useId();
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

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
	};

	return (
		<BaseSelectionSliderLayout
			id={id}
			inputRef={inputRef}
			currentValue={currentValue}
			sliderMin={0}
			sliderMax={Math.max(0, values.length - 1)}
			sliderValue={selection}
			onSliderChange={handleSliderChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			stopPropagation={stopPropagation}
			label={label}
			renderFormat={format ? <OptionFormat format={format} /> : undefined}
			testId={testId}
			className={className}
			inputClassName={inputClassName}
		/>
	);
}
