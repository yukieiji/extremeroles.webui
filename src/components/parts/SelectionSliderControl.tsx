import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { useSelectionSlider } from "@/hooks/useSelectionSlider";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface SelectionSliderControlProps {
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
 * 汎用的な選択スライダーコントロール
 */
export function SelectionSliderControl({
	label,
	selection,
	values,
	onChange,
	renderFormat,
	testId,
	className,
	inputClassName,
}: SelectionSliderControlProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
		stopPropagation,
	} = useSelectionSlider(selection, values, onChange);

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
