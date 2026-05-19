import { useId, useRef } from "react";
import { findClosestIndex } from "@/logics/optionUtils";
import { OptionFormat } from "../parts/OptionFormat";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface OptionSingleSliderProps {
	label: string;
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
}

export function OptionSingleSlider({
	label,
	selection,
	values,
	format,
	onChange,
}: OptionSingleSliderProps) {
	const id = useId();
	const currentValue = values[selection] ?? values[0] ?? 0;
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSliderChange = (val: number | readonly number[]) => {
		onChange(Array.isArray(val) ? val[0] : val);
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
			commitValue();
			e.currentTarget.blur();
		}
	};

	return (
		<FieldSet>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<Input
					id={id}
					ref={inputRef}
					type="text"
					key={selection}
					defaultValue={currentValue.toString()}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				<Label htmlFor={id}>
					<OptionFormat format={format} />
				</Label>
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				aria-label={label}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
