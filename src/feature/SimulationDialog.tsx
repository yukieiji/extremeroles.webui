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
		<DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
			<DialogHeader>
				<DialogTitle className={TYPOGRAPHY.LABEL}>{title}</DialogTitle>
			</DialogHeader>
			<div className="flex-1 flex overflow-hidden gap-2 p-2">
				{/* Result View */}
				<div className="flex-1 rounded-md p-2 pr-4 overflow-y-scroll">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{result.map((res, i) => (
							<SimulateResultCard
								// biome-ignore lint/suspicious/noArrayIndexKey: シミュレーション結果には一意のIDがないため、インデックスと内容を組み合わせてキーとして使用
								key={`${i}-${JSON.stringify(res)}`}
								result={res}
								index={i}
							/>
						))}
					</div>
				</div>

				{/* Controls */}
				<div className="w-64 flex flex-col p-2 gap-2">
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
					<div className="py-2 flex flex-col gap-2">
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
			</div>
		</DialogContent>
	);
}
