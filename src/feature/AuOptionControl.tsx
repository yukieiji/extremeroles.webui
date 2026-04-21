import { OptionToggleControl } from "../components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
import type { AuOptionMeta } from "../type";

interface AuOptionControlProps {
	optionMeta: AuOptionMeta;
	selection: number;
	onSelectionChange: (selection: number) => void;
}

/**
 * Auのオプション値を変更するためのコントロール
 */
export function AuOptionControl({
	optionMeta,
	selection,
	onSelectionChange,
}: AuOptionControlProps) {
	const range = optionMeta.range;

	// Boolean型の判定
	if (range.length === 2 && typeof range[0] === "boolean") {
		return (
			<OptionToggleControl
				selection={selection}
				values={["<color=#ff0000>OFF</color>", "<color=#00ff00>ON</color>"]}
				onChange={onSelectionChange}
			/>
		);
	}

	// 数値(Slider)か文字列(Selector)かの判定
	if (typeof range[0] === "number") {
		const numRange = range as number[];
		return (
			<OptionSliderControl
				values={numRange}
				selection={selection}
				format={optionMeta.format}
				onChange={onSelectionChange}
			/>
		);
	}

	return (
		<OptionDropdownControl
			values={range as string[]}
			selection={selection}
			onChange={onSelectionChange}
		/>
	);
}
