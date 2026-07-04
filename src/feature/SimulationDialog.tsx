import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TYPOGRAPHY } from "@/designConstants";
import { postSimulate } from "@/logics/api";

interface SimulationDialogProps {
	title: string;
}

export function SimulationDialog({ title }: SimulationDialogProps) {
	const [cycle, setCycle] = useState(1);
	const [playerNum, setPlayerNum] = useState(15);
	const [result, setResult] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

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
						<label className={TYPOGRAPHY.LABEL}>Cycle (1 - 100)</label>
						<div className="flex items-center gap-4">
							<Slider
								value={[cycle]}
								onValueChange={(val) => setCycle(val[0])}
								min={1}
								max={100}
								step={1}
							/>
							<Input
								type="number"
								value={cycle}
								onChange={(e) => {
									const val = Number(e.target.value);
									if (val >= 1 && val <= 100) setCycle(val);
								}}
								className="w-20"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<label className={TYPOGRAPHY.LABEL}>Player Num (4 - 100)</label>
						<div className="flex items-center gap-4">
							<Slider
								value={[playerNum]}
								onValueChange={(val) => setPlayerNum(val[0])}
								min={4}
								max={100}
								step={1}
							/>
							<Input
								type="number"
								value={playerNum}
								onChange={(e) => {
									const val = Number(e.target.value);
									if (val >= 4 && val <= 100) setPlayerNum(val);
								}}
								className="w-20"
							/>
						</div>
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
