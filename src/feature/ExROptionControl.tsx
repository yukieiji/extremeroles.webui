import { OptionToggleControl } from "../components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
import type { ExROptionDto } from "../type";

interface ExROptionControlProps {
	categoryId: number;
	option: ExROptionDto;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({
	option,
}: ExROptionControlProps) {
	const currentSelection = option.Selection;

	const handleChange = (_newSelection: number) => {
		// PUTリクエストはまだ実装しないため、ここでは何もしない
	};

	const { Type, Values } = option.RangeMeta;

	if (Type === "String") {
		const stringValues = Values as string[];
		const isToggleType =
			stringValues.length === 2 &&
			stringValues.every((val) => {
				return val.includes("<color=#");
			});

		if (isToggleType) {
			return (
				<OptionToggleControl
					selection={currentSelection}
					values={stringValues}
					onChange={handleChange}
				/>
			);
		}

		return (
			<OptionDropdownControl
				selection={currentSelection}
				values={stringValues}
				onChange={handleChange}
			/>
		);
	}

	if (Type === "Int32" || Type === "Single") {
		return (
			<OptionSliderControl
				selection={currentSelection}
				values={Values as number[]}
				format={option.Format}
				onChange={handleChange}
			/>
		);
	}

	return null;
}
