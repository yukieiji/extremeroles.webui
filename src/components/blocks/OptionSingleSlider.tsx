import { useId, useState, useEffect } from "react";
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
	const [inputValue, setInputValue] = useState(currentValue.toString());

	useEffect(() => {
		setInputValue(currentValue.toString());
	}, [currentValue]);

	const handleSliderChange = (val: number | readonly number[]) => {
		onChange(Array.isArray(val) ? val[0] : val);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		setInputValue(nextValue);

		const val = parseFloat(nextValue);
		if (Number.isNaN(val)) {
			return;
		}

		onChange(findClosestIndex(values, val));
	};

	const handleBlur = () => {
		setInputValue(currentValue.toString());
	};

	return (
		<FieldSet>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<Input
					id={id}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleBlur}
				/>
				<Label htmlFor={id}>
					<OptionFormat format={format} />
				</Label>
			</Field>
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				aria-label={label}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
