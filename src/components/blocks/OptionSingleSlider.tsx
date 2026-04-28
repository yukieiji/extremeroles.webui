import { findClosestIndex } from "../../logics/optionUtils";
import { OptionFormat } from "../parts/OptionFormat";

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
	const currentValue = values[selection] ?? values[0] ?? 0;

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(parseInt(e.target.value, 10));
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
				<span className="text-xs text-gray-400 font-medium">{label}</span>
				<div className="flex items-center gap-1">
					<input
						type="text"
						value={currentValue}
						onChange={handleInputChange}
						disabled={disabled}
						className="w-12 px-1 py-0.5 text-right text-xs bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
					/>
					<OptionFormat format={format} />
				</div>
			</div>
			<input
				type="range"
				min={0}
				max={values.length - 1}
				step={1}
				value={selection}
				onChange={handleSliderChange}
				disabled={disabled}
				aria-label={label}
				className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>
	);
}
