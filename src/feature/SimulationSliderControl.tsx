import { BaseSelectionSlider } from "@/components/parts/BaseSelectionSlider";

interface SimulationSliderControlProps {
	label: string;
	selection: number;
	values: number[];
	onChange: (selection: number) => void;
}

/**
 * シミュレーション設定用のスライダーコントロール
 */
export function SimulationSliderControl({
	label,
	selection,
	values,
	onChange,
}: SimulationSliderControlProps) {
	return (
		<BaseSelectionSlider
			label={label}
			selection={selection}
			values={values}
			onChange={onChange}
		/>
	);
}
