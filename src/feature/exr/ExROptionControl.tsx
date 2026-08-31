import { OptionSliderControl } from "@/components/blocks/OptionSliderControl";
import { OptionToggleControl } from "@/components/blocks/OptionToggleControl";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import { useOptionData } from "@/hooks/useExROptionData";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import type { UniqueOptionId } from "@/type";

interface ExROptionControlProps {
	uniqueOptionId: UniqueOptionId;
	format: string;
	type: string;
	disabled?: boolean;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({
	uniqueOptionId,
	format,
	type,
	disabled,
}: ExROptionControlProps) {
	const optionValue = useOptionData(uniqueOptionId);
	const currentSelection = optionValue.selection ?? 0;

	const updateExRSelection = useUpdateExROptionSelection();

	const handleChange = async (selection: number) => {
		await updateExRSelection({ uniqueOptionId, selection });
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
					disabled={disabled}
				/>
			);
		}

		return (
			<OptionDropdownControl
				selection={currentSelection}
				values={stringValues}
				onChange={(newValue) => {
					handleChange(newValue);
				}}
				disabled={disabled}
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
				disabled={disabled}
			/>
		);
	}

	return null;
}
