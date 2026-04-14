import { OptionToggleControl } from "../components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { OptionSliderControl } from "../components/parts/OptionSliderControl";
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
	const currentSelection = option.Selection;
	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});
	const isPending = useStore((state) => {
		const uniqueId = getUniqueOptionId(categoryId, option.Id);
		return !!state.pendingExROptionIds[uniqueId];
	});

	const handleChange = (newSelection: number) => {
		updateExROptionSelection(categoryId, option.Id, newSelection);
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
				<div className={isPending ? "opacity-50 pointer-events-none" : ""}>
					<OptionToggleControl
						selection={currentSelection}
						values={stringValues}
						onChange={handleChange}
					/>
				</div>
			);
		}

		return (
			<div className={isPending ? "opacity-50 pointer-events-none" : ""}>
				<OptionDropdownControl
					selection={currentSelection}
					values={stringValues}
					onChange={handleChange}
				/>
			</div>
		);
	}

	if (Type === "Int32" || Type === "Single") {
		return (
			<div className={isPending ? "opacity-50 pointer-events-none" : ""}>
				<OptionSliderControl
					selection={currentSelection}
					values={Values as number[]}
					format={option.Format}
					onChange={handleChange}
				/>
			</div>
		);
	}

	return null;
}
