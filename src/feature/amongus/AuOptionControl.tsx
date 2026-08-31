import { OptionSliderControl } from "@/components/blocks/OptionSliderControl";
import { OptionToggleControl } from "@/components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import { translationMetaData } from "@/logics/api";
import type { AuOptionMeta } from "@/type";

interface AuOptionControlProps {
	optionMeta: AuOptionMeta;
	selection: number;
	onSelectionChange: (selection: number) => void;
	disabled: boolean;
}

/**
 * Auのオプション値を変更するためのコントロール
 */
export function AuOptionControl({
	optionMeta,
	selection,
	onSelectionChange,
	disabled,
}: AuOptionControlProps) {
	const range = optionMeta.range;

	// Boolean型の判定
	if (range.length === 2 && typeof range[0] === "boolean") {
		return (
			<OptionToggleControl
				selection={selection}
				values={[translationMetaData[0], translationMetaData[1]]}
				onChange={onSelectionChange}
				disabled={disabled}
			/>
		);
	}

	// 数値(Slider)か文字列(Selector)かの判定
	if (typeof range[0] === "number") {
		return (
			<OptionSliderControl
				values={range as number[]}
				selection={selection}
				format={optionMeta.format}
				onChange={onSelectionChange}
				disabled={disabled}
			/>
		);
	}

	return (
		<OptionDropdownControl
			values={range as string[]}
			selection={selection}
			onChange={(newValue) => {
				onSelectionChange(newValue);
			}}
			disabled={disabled}
		/>
	);
}
