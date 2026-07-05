import { use } from "react";
import { SimulationControlTitleLayout } from "@/components/parts/SimulationControlTitleLayout";
import { getLobbyInfo } from "@/logics/api.store";
import { useStore } from "@/useStore";
import { LobbyInfoView } from "../LobbyInfoView";
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
			<SimulationControlTitleLayout text={"詳細設定"} />
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
			<SimulationControlTitleLayout text={"ロビー情報"} />
			<LobbyInfoView lobbyInfo={lobbyInfo} />
		</>
	);
}
