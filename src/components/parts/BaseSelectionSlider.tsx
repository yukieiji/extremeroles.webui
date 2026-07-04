import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { findClosestIndex } from "@/logics/optionUtils";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface BaseSelectionSliderProps {
	label?: string;
	selection: number;
	values: number[];
	onChange: (selection: number) => void;
	renderFormat?: ReactNode;
	testId?: string;
	className?: string;
	inputClassName?: string;
}

/**
 * 汎用的な選択スライダーのベースコンポーネント
 * スライダーと数値入力フィールドを同期させるロジックを含みます
 */
export function BaseSelectionSlider({
	label,
	selection,
	values,
	onChange,
	renderFormat,
	testId,
	className,
	inputClassName,
}: BaseSelectionSliderProps) {
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
		<FieldSet
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
			className={className}
		>
			<Field orientation="horizontal">
				{label && (
					<FieldLabel
						htmlFor={id}
						className={`${TYPOGRAPHY.CHILD_LABEL} select-text w-full`}
						aria-hidden="true"
					>
						{label}
					</FieldLabel>
				)}
				<Input
					id={id}
					ref={inputRef}
					type="number"
					defaultValue={currentValue.toString()}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={inputClassName}
				/>
				{renderFormat && (
					<Label htmlFor={id} className="select-text">
						{renderFormat}
					</Label>
				)}
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
