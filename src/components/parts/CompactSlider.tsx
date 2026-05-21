import { OptionSliderControl } from "./OptionSliderControl";

interface CompactSliderProps {
	label: string;
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
	/** @deprecated OptionSliderControl handles input logic internally */
	onInputChange?: (value: number) => void;
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
	testId,
}: CompactSliderProps) {
	return (
		<OptionSliderControl
			label={label}
			values={values}
			selection={currentSelection}
			onChange={onSelectionChange}
			testId={testId}
		/>
	);
}
