import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
import { OptionToggleControl } from "../components/parts/OptionToggleControl";
import { getUniqueOptionId } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";

interface ExROptionControlProps {
	categoryId: number;
	option: ExROptionDto;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({
	categoryId,
	option,
}: ExROptionControlProps) {
	const uniqueId = getUniqueOptionId(categoryId, option.Id);
	const effectiveSelection = useStore((state) => {
		return state.effectiveSelections[uniqueId];
	});
	const currentSelection = effectiveSelection ?? option.Selection;
	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const handleChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(uniqueId, newSelection);
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
