import { ROLE_SPAWN_COUNT, ROLE_SPAWN_RATE } from "@/noTrans";
import { OptionSliderControl } from "../parts/OptionSliderControl";

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
		<div className="flex items-center gap-4 w-[400px]">
			<OptionSliderControl
				label={ROLE_SPAWN_RATE}
				values={rate.values}
				selection={rate.currentSelection}
				onChange={rate.onSelectionChange}
				format="%"
				testId="spawn-rate-control"
				className="flex-1"
				labelClassName="w-24"
			/>
			<OptionSliderControl
				label={ROLE_SPAWN_COUNT}
				values={num.values}
				selection={num.currentSelection}
				onChange={num.onSelectionChange}
				testId="spawn-count-control"
				className="flex-1"
				labelClassName="w-24"
			/>
		</div>
	);
}
