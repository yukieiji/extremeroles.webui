import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_PRIMARY_BUTTUN_COLORS, TYPOGRAPHY } from "@/designConstants";
import { postSimulate } from "@/logics/api";
import { useStore } from "@/useStore";
import { SimulateResultCard } from "./exr/SimulateResultCard";
import { SimulationSliderControl } from "./SimulationSliderControl";

interface SimulationDialogProps {
	title: string;
}

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
			setResult(res);
		} catch (error) {
			console.error(error);
			setResult([]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="max-w-7xl h-[80vh] flex flex-col">
			<DialogHeader>
				<DialogTitle className={TYPOGRAPHY.LABEL}>{title}</DialogTitle>
			</DialogHeader>
			<div className="flex-1 flex overflow-hidden gap-2 p-2">
				{/* Result View */}
				<div className="flex-1 border border-border-strong rounded-md bg-app-background p-4 overflow-auto">
					{result.map((res, i) => (
						<SimulateResultCard
							key={`${i}-${JSON.stringify(res)}`}
							result={res}
							index={i}
						/>
					))}
				</div>

				{/* Controls */}
				<div className="w-64 flex flex-col gap-4 p-2 border-l border-border-weak">
					<Button
						className={`${DEFAULT_PRIMARY_BUTTUN_COLORS} w-full`}
						onClick={handleSimulate}
						disabled={isLoading}
					>
						<Play className="w-4 h-4" />
						{isLoading ? "Executing..." : "Execute"}
					</Button>
					<span
						className={`${TYPOGRAPHY.LABEL} text-text-primary mx-auto pt-4`}
					>
						詳細設定
					</span>
					<Separator />
					<SimulationSliderControl
						label="Cycle"
						value={cycle}
						min={1}
						max={100}
						onValueChange={setCycle}
					/>
					<SimulationSliderControl
						label="Player Num"
						value={playerNum}
						min={4}
						max={100}
						onValueChange={setPlayerNum}
					/>
				</div>
			</div>
		</DialogContent>
	);
}
