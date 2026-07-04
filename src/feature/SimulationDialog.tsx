import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TYPOGRAPHY } from "@/designConstants";
import { postSimulate } from "@/logics/api";
import { useStore } from "@/useStore";
import { SimulationSliderControl } from "./SimulationSliderControl";

interface SimulationDialogProps {
	title: string;
}

const CYCLE_VALUES = Array.from({ length: 100 }, (_, i) => i + 1);
const PLAYER_NUM_VALUES = Array.from({ length: 97 }, (_, i) => i + 4);

export function SimulationDialog({ title }: SimulationDialogProps) {
	const cycle = useStore((state) => state.simulationCycle);
	const setCycle = useStore((state) => state.setSimulationCycle);
	const playerNum = useStore((state) => state.simulationPlayerNum);
	const setPlayerNum = useStore((state) => state.setSimulationPlayerNum);
	const result = useStore((state) => state.simulationResult);
	const setResult = useStore((state) => state.setSimulationResult);
	const isLoading = useStore((state) => state.isSimulationLoading);
	const setIsLoading = useStore((state) => state.setIsSimulationLoading);

	const handleSimulate = async () => {
		setIsLoading(true);
		try {
			const res = await postSimulate({
				Cycle: cycle,
				Option: {
					PlayerNum: playerNum,
				},
				MockPlayerNames: null,
			});
			setResult(JSON.stringify(res));
		} catch (error) {
			setResult(String(error));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="max-w-4xl h-[80vh] flex flex-col">
			<DialogHeader>
				<DialogTitle className={TYPOGRAPHY.LABEL}>{title}</DialogTitle>
			</DialogHeader>
			<div className="flex-1 flex overflow-hidden gap-4 p-2">
				{/* Result View */}
				<div className="flex-1 border border-border-strong rounded-md bg-app-background p-2 overflow-auto font-mono text-xs break-all">
					{result}
				</div>

				{/* Controls */}
				<div className="w-80 flex flex-col gap-6 p-2 border-l border-border-weak">
					<div className="flex flex-col gap-4">
						<SimulationSliderControl
							label="Cycle"
							value={cycle}
							min={1}
							max={100}
							onValueChange={setCycle}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<SimulationSliderControl
							label="Player Num"
							value={playerNum}
							min={4}
							max={100}
							onValueChange={setPlayerNum}
						/>
					</div>

					<div className="mt-auto">
						<Button
							className="w-full"
							onClick={handleSimulate}
							disabled={isLoading}
						>
							{isLoading ? "Executing..." : "Execute"}
						</Button>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}
