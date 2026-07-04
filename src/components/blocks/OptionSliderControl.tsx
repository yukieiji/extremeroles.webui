import { OptionFormat } from "../parts/OptionFormat";
import { SelectionSliderControl } from "../parts/SelectionSliderControl";

interface OptionSliderControlProps {
	label?: string;
	selection: number;
	values: number[];
	format?: string;
	onChange: (selection: number) => void;
	testId?: string;
	className?: string;
	inputClassName?: string;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	label,
	selection,
	values,
	format,
	onChange,
	testId,
	className,
	inputClassName,
}: OptionSliderControlProps) {
	return (
		<SelectionSliderControl
			label={label}
			selection={selection}
			values={values}
			onChange={onChange}
			renderFormat={format ? <OptionFormat format={format} /> : undefined}
			testId={testId}
			className={className}
			inputClassName={inputClassName}
		/>
	);
}
