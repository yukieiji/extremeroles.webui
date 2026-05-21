import { OptionSliderControl } from "./OptionSliderControl";

interface CompactSliderProps {
	label: string;
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
	/** @deprecated OptionSliderControl handles input logic internally */
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
	format,
	testId,
}: CompactSliderProps) {
	return (
		<OptionSliderControl
			label={label}
			values={values}
			selection={currentSelection}
			onChange={onSelectionChange}
			format={format}
			testId={testId}
		/>
	);
}
