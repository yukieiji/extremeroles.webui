import { OptionToggleControl } from "../components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
import { useOptionData } from "../logics/optionUtils";
import { useStore } from "../useStore";

interface ExROptionControlProps {
	uniqueOptionId: number;
	format: string;
	type: string;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({
	uniqueOptionId,
	format,
	type,
}: ExROptionControlProps) {
	const effectiveSelection = useStore((state) => {
		return state.effectiveSelections[uniqueOptionId];
	});
	const optionValue = useOptionData(uniqueOptionId);

	const currentSelection = effectiveSelection ?? optionValue.selection;
	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const handleChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(uniqueOptionId, newSelection);
	};

	if (type === "String") {
		const stringValues = optionValue.values as string[];
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

	if (type === "Int32" || type === "Single") {
		return (
			<OptionSliderControl
				selection={currentSelection}
				values={optionValue.values as number[]}
				format={format}
				onChange={handleChange}
			/>
		);
	}

	return null;
}
