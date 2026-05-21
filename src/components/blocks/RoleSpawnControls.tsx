import { ROLE_SPAWN_COUNT, ROLE_SPAWN_RATE } from "@/noTrans";
import { CompactSlider } from "../parts/CompactSlider";

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
			<CompactSlider
				label={ROLE_SPAWN_RATE}
				values={rate.values}
				currentSelection={rate.currentSelection}
				onSelectionChange={rate.onSelectionChange}
				testId="spawn-rate-control"
			/>
			<CompactSlider
				label={ROLE_SPAWN_COUNT}
				values={num.values}
				currentSelection={num.currentSelection}
				onSelectionChange={num.onSelectionChange}
				testId="spawn-count-control"
			/>
		</div>
	);
}
