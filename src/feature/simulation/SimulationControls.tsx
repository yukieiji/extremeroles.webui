import { use } from "react";
import { SimulationControlTitleLayout } from "@/components/parts/SimulationControlTitleLayout";
import { getLobbyInfo } from "@/logics/api.store";
import {
	CYCLE_LABEL,
	DETAILS_SETTING_TITLE,
	LOBBY_INFO_TITLE,
	PLAYER_NUM_LABEL,
} from "@/noTrans";
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
			<SimulationControlTitleLayout text={DETAILS_SETTING_TITLE} />
			<div className="py-2 flex flex-col gap-2">
				<SimulationSliderControl
					label={CYCLE_LABEL}
					value={cycle}
					min={1}
					max={100}
					onValueChange={setCycle}
				/>
				<SimulationSliderControl
					label={PLAYER_NUM_LABEL}
					value={playerNum}
					min={4}
					max={lobbyInfo?.Online?.MaxPlayerNum ?? 100}
					onValueChange={setPlayerNum}
				/>
			</div>
			<SimulationControlTitleLayout text={LOBBY_INFO_TITLE} />
			<LobbyInfoView lobbyInfo={lobbyInfo} />
		</>
	);
}
