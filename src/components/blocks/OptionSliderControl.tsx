import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { findClosestIndex } from "@/logics/optionUtils";
import { OptionFormat } from "../parts/OptionFormat";

interface OptionSliderControlProps {
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
	disabled?: boolean;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	selection,
	values,
	format,
	onChange,
	disabled = false,
}: OptionSliderControlProps) {
	const currentValue = values[selection] ?? values[0] ?? 0;

	const handleSliderChange = (val: number | readonly number[]) => {
		if (typeof val === "number") {
			onChange(val);
		} else if (Array.isArray(val)) {
			onChange(val[0]);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseFloat(e.target.value);
		if (Number.isNaN(val)) {
			return;
		}

		onChange(findClosestIndex(values, val));
	};

	return (
		<div className="flex items-center gap-4 w-full h-10 sm:w-64">
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				disabled={disabled}
			/>
			<div className="flex items-center gap-2 min-w-20">
				<Input
					type="text"
					value={currentValue}
					onChange={handleInputChange}
					disabled={disabled}
					className="w-16 text-right"
				/>
				<OptionFormat format={format} />
			</div>
		</div>
	);
}
