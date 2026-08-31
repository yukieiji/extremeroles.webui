import { BaseSelectionSliderLayout } from "@/components/parts/BaseSelectionSliderLayout";
import { OptionFormat } from "@/components/parts/OptionFormat";
import { useOptionSlider } from "@/hooks/useOptionSlider";

interface OptionSliderControlProps {
	label?: string;
	selection: number;
	values: number[];
	format?: string;
	onChange: (selection: number) => void;
	testId?: string;
	className?: string;
	inputClassName?: string;
	disabled?: boolean;
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
	disabled,
}: OptionSliderControlProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
		stopPropagation,
	} = useOptionSlider(selection, values, onChange);

	return (
		<BaseSelectionSliderLayout
			id={id}
			inputRef={inputRef}
			currentValue={currentValue}
			sliderMin={0}
			sliderMax={Math.max(0, values.length - 1)}
			sliderValue={selection}
			onSliderChange={handleSliderChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			stopPropagation={stopPropagation}
			label={label}
			renderFormat={format ? <OptionFormat format={format} /> : undefined}
			testId={testId}
			className={className}
			inputClassName={inputClassName}
			disabled={disabled}
		/>
	);
}
