import { findClosestIndex } from "../../logics/optionUtils";

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

	const formattedValue = format.includes("{0}")
		? format.replace("{0}", currentValue.toString())
		: `${format} ${currentValue}`.trim();

	return (
		<div className="flex items-center gap-4 w-full sm:w-64">
			<input
				type="range"
				min={0}
				max={values.length - 1}
				step={1}
				value={selection}
				onChange={handleSliderChange}
				disabled={disabled}
				className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
			/>
			<div className="flex items-center gap-2 min-w-[5rem]">
				<input
					type="text"
					value={currentValue}
					onChange={handleInputChange}
					disabled={disabled}
					className="w-16 px-2 py-1 text-right text-sm bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
				/>
				<span className="text-xs text-gray-400 whitespace-nowrap">
					({formattedValue})
				</span>
			</div>
		</div>
	);
}
