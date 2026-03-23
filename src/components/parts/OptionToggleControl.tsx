import { ColoredText } from "./ColoredText";

interface OptionToggleControlProps {
	selection: number; // 0 or 1
	values: string[];
	onChange: (selection: number) => void;
	disabled?: boolean;
}

/**
 * 特定の条件を満たす文字列オプション用のトグルスイッチコンポーネント
 */
export function OptionToggleControl({
	selection,
	values,
	onChange,
	disabled = false,
}: OptionToggleControlProps) {
	const isOn = selection === 1;

	const handleToggle = () => {
		if (!disabled) {
			onChange(isOn ? 0 : 1);
		}
	};

	return (
		<div className="flex items-center gap-3 h-12">
			<button
				type="button"
				onClick={handleToggle}
				disabled={disabled}
				className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
					isOn ? "bg-blue-600" : "bg-gray-700"
				} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
				role="switch"
				aria-checked={isOn}
				data-testid="option-toggle"
			>
				<span
					aria-hidden="true"
					className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
						isOn ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
			<div className="text-sm font-medium text-gray-300 min-w-24 overflow-hidden text-ellipsis whitespace-nowrap">
				<ColoredText text={values[selection]} />
			</div>
		</div>
	);
}
