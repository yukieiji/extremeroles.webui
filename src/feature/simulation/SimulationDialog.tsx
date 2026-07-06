import { Play } from "lucide-react";
import { Suspense, useEffect } from "react";
import { LobbyLoadingView } from "@/components/blocks/LobbyLoadingView";
import { LoadingCycle } from "@/components/parts/LoadingCycle";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_PRIMARY_BUTTUN_COLORS, TYPOGRAPHY } from "@/designConstants";
import { postSimulate, translationMetaData } from "@/logics/api";
import { resetLobbyInfoCache } from "@/logics/api.store";
import { useStore } from "@/useStore";
import { SimulateResultCard } from "./SimulateResultCard";
import { SimulationControls } from "./SimulationControls";

interface SimulationDialogProps {
	title: string;
}

export function SimulationDialog({ title }: SimulationDialogProps) {
	const cycle = useStore((state) => state.simulationCycle);
	const playerNum = useStore((state) => state.simulationPlayerNum);
	const result = useStore((state) => state.simulationResult);
	const setResult = useStore((state) => state.setSimulationResult);
	const isLoading = useStore((state) => state.isSimulationLoading);
	const setIsLoading = useStore((state) => state.setIsSimulationLoading);
	const setLobbyInfo = useStore((state) => state.setLobbyInfo);

	useEffect(() => {
		return () => {
			setLobbyInfo(null);
			setResult([]);
			resetLobbyInfoCache();
		};
	}, [setLobbyInfo, setResult]);

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
					{isLoading || result.length === 0 ? (
						<div className="h-full flex items-center justify-center">
							{isLoading ? (
								<LoadingCycle />
							) : (
								<span className={TYPOGRAPHY.LABEL}>
									{translationMetaData.EMPTY_SIMULATE_MESSAGE}
								</span>
							)}
						</div>
					) : (
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
					)}
				</div>
				{/* Controls View */}
				<div className="w-64 flex flex-col p-2 gap-2 overflow-hidden">
					<Button
						className={`${DEFAULT_PRIMARY_BUTTUN_COLORS} w-full`}
						onClick={handleSimulate}
						disabled={isLoading}
					>
						<Play className="w-4 h-4" />
						{isLoading ? translationMetaData.EXECUTING_LABEL : translationMetaData.EXECUTE_BUTTON_LABEL}
					</Button>
					<Suspense fallback={<LobbyLoadingView />}>
						<SimulationControls />
					</Suspense>
				</div>
			</div>
		</DialogContent>
	);
}
