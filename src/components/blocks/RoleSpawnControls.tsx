import { translationMetaData } from "@/logics/api";
import { OptionSliderControl } from "./OptionSliderControl";

interface ControlProps {
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
}

interface RoleSpawnControlsProps {
	rate: ControlProps;
	num: ControlProps;
}

export function RoleSpawnControls({ rate, num }: RoleSpawnControlsProps) {
	return (
		<div className="flex items-center gap-4">
			<OptionSliderControl
				label={translationMetaData.SpawnRate}
				values={rate.values}
				selection={rate.currentSelection}
				onChange={rate.onSelectionChange}
				format="%"
				testId="spawn-rate-control"
				className="w-64"
				inputClassName="w-24"
				disabled={false}
			/>
			<OptionSliderControl
				label={translationMetaData.RoleNum}
				values={num.values}
				selection={num.currentSelection}
				onChange={num.onSelectionChange}
				testId="spawn-count-control"
				className="w-64"
				inputClassName="w-24"
				disabled={false}
			/>
		</div>
	);
}
