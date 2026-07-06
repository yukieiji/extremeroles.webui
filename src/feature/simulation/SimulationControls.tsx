import { use } from "react";
import { SimulationControlTitleLayout } from "@/components/parts/SimulationControlTitleLayout";
import { translationMetaData } from "@/logics/api";
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
			<SimulationControlTitleLayout
				text={translationMetaData.SIMULATE_DETAILS_SETTING}
			/>
			<div className="py-2 flex flex-col gap-2">
				<SimulationSliderControl
					label={translationMetaData.CYCLE_LABEL}
					value={cycle}
					min={1}
					max={100}
					onValueChange={setCycle}
				/>
				<SimulationSliderControl
					label={translationMetaData.PLAYER_NUM_LABEL}
					value={playerNum}
					min={4}
					max={lobbyInfo?.Online?.MaxPlayerNum ?? 100}
					onValueChange={setPlayerNum}
				/>
			</div>
			<SimulationControlTitleLayout
				text={translationMetaData.LOBBY_INFO_TITLE}
			/>
			<LobbyInfoView lobbyInfo={lobbyInfo} />
		</>
	);
}
