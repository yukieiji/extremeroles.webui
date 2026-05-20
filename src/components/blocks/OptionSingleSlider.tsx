import { useId } from "react";
import { useOptionSlider } from "@/hooks/useOptionSlider";
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
	const {
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
	} = useOptionSlider({ selection, values, onChange });

	return (
		<FieldSet>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<Input
					id={id}
					ref={inputRef}
					type="text"
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
