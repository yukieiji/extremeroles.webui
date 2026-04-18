import { useCallback } from "react";
import { OptionToggleControl } from "../components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId } from "../logics/optionUtils";
import { useStore } from "../useStore";

interface ExROptionControlProps {
	categoryId: number;
	optionId: number;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({
	categoryId,
	optionId,
}: ExROptionControlProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, optionId);
	const valueData = useStore(
		useCallback(
			(state) => {
				return state.valueData[uniqueId];
			},
			[uniqueId],
		),
	);
	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});

	const handleChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(uniqueId, newSelection);
	};

	const meta = exrOptionMetaData.optionMetaData[uniqueId];
	if (!meta || !valueData) {
		return null;
	}

	const { type: Type, format: Format } = meta;
	const { selection: currentSelection, values: Values } = valueData;

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
				format={Format}
				onChange={handleChange}
			/>
		);
	}

	return null;
}
