import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { findClosestIndex } from "@/logics/optionUtils";
import { OptionFormat } from "../parts/OptionFormat";
import { Field, FieldSet } from "../ui/field";
import { Label } from "../ui/label";

interface OptionSliderControlProps {
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	selection,
	values,
	format,
	onChange,
}: OptionSliderControlProps) {
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
		<FieldSet>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
			<Field orientation="horizontal">
				<Input
					id={id}
					type="text"
					value={currentValue}
					onChange={handleInputChange}
				/>
				<Label htmlFor={id}>
					<OptionFormat format={format} />
				</Label>
			</Field>
		</FieldSet>
	);
}
