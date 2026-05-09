import { useId } from "react";
import { findClosestIndex } from "@/logics/optionUtils";
import { OptionFormat } from "../parts/OptionFormat";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface OptionSingleSliderProps {
	label: string;
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
	disabled?: boolean;
}

export function OptionSingleSlider({
	label,
	selection,
	values,
	format,
	onChange,
	disabled = false,
}: OptionSingleSliderProps) {
	const id = useId();
	const currentValue = values[selection] ?? values[0] ?? 0;

	const handleSliderChange = (val: number | readonly number[]) => {
		onChange(Array.isArray(val) ? val[0] : val);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseFloat(e.target.value);
		if (Number.isNaN(val)) {
			return;
		}

		onChange(findClosestIndex(values, val));
	};

	return (
		<div className="flex flex-col gap-1 w-full">
			<div className="flex items-center justify-between gap-2 px-1">
				<Label htmlFor={id} className="text-xs text-muted-foreground font-medium">
					{label}
				</Label>
				<Field orientation="horizontal" className="w-auto gap-1">
					<Input
						id={id}
						type="text"
						value={currentValue}
						onChange={handleInputChange}
						disabled={disabled}
						className="w-12 h-7 px-1 py-0.5 text-right text-xs"
					/>
					<Label htmlFor={id}>
						<OptionFormat format={format} />
					</Label>
				</Field>
			</div>
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				disabled={disabled}
				aria-label={label}
				className="w-full"
			/>
		</div>
	);
}
