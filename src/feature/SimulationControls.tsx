import { use } from "react";
import { Separator } from "@/components/ui/separator";
import { TYPOGRAPHY } from "@/designConstants";
import { getLobbyInfo } from "@/logics/api.store";
import { useStore } from "@/useStore";
import { LobbyInfoView } from "./LobbyInfoView";
import { SimulationSliderControl } from "./SimulationSliderControl";

export function SimulationControls() {
	const cycle = useStore((state) => state.simulationCycle);
	const setCycle = useStore((state) => state.setSimulationCycle);
	const playerNum = useStore((state) => state.simulationPlayerNum);
	const setPlayerNum = useStore((state) => state.setSimulationPlayerNum);
	const lobbyInfo = useStore((state) => state.lobbyInfo);

	use(getLobbyInfo());

	return (
		<>
			<span className={`${TYPOGRAPHY.LABEL} text-text-primary mx-auto pt-4`}>
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
					max={lobbyInfo?.Online?.MaxPlayerNum ?? 100}
					onValueChange={setPlayerNum}
				/>
			</div>
			<LobbyInfoView lobbyInfo={lobbyInfo} />
		</>
	);
}
