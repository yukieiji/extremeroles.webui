import { OptionSliderControl } from "./OptionSliderControl";

interface CompactSliderProps {
	label: string;
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
	onInputChange?: (value: number) => void;
	format?: string;
	testId?: string;
}

/**
 * カテゴリアコーディオンのヘッダーなどで使用する、コンパクトなスライダーとテキスト入力のセット
 * (OptionSliderControlのラッパー)
 */
export function CompactSlider({
	label,
	values,
	currentSelection,
	onSelectionChange,
	onInputChange,
	format,
	testId,
}: CompactSliderProps) {
	return (
		<OptionSliderControl
			label={label}
			values={values}
			selection={currentSelection}
			onChange={onSelectionChange}
			onInputChange={onInputChange}
			format={format}
			testId={testId}
		/>
	);
}
