import { CompactSlider } from "../parts/CompactSlider";

interface ControlProps {
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
	onInputChange: (value: number) => void;
}

interface RoleSpawnControlsProps {
	rate: ControlProps;
	num: ControlProps;
}

export function RoleSpawnControls({ rate, num }: RoleSpawnControlsProps) {
	return (
		<div className="flex items-center gap-4">
			<CompactSlider
				label="レート"
				values={rate.values}
				currentSelection={rate.currentSelection}
				onSelectionChange={rate.onSelectionChange}
				onInputChange={rate.onInputChange}
				testId="spawn-rate-control"
			/>
			<CompactSlider
				label="数"
				values={num.values}
				currentSelection={num.currentSelection}
				onSelectionChange={num.onSelectionChange}
				onInputChange={num.onInputChange}
				testId="spawn-count-control"
			/>
		</div>
	);
}
