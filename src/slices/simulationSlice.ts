import type { StateCreator } from "zustand";
import type { LobbyInfo, SimulateResult } from "../type";

/**
 * シミュレーションの状態を管理するスライスのインターフェース
 */
export interface SimulationSlice {
	simulationCycle: number;
	simulationPlayerNum: number;
	simulationResult: SimulateResult[];
	isSimulationLoading: boolean;
	lobbyInfo: LobbyInfo | null;
	setSimulationCycle: (cycle: number) => void;
	setSimulationPlayerNum: (playerNum: number) => void;
	setSimulationResult: (result: SimulateResult[]) => void;
	setIsSimulationLoading: (isLoading: boolean) => void;
	setLobbyInfo: (lobbyInfo: LobbyInfo | null) => void;
}

/**
 * シミュレーションの状態管理を行うスライスの生成
 */
export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => {
	return {
		simulationCycle: 1,
		simulationPlayerNum: 15,
		simulationResult: [],
		isSimulationLoading: false,
		lobbyInfo: null,
		setSimulationCycle: (cycle: number) => {
			set({ simulationCycle: cycle });
		},
		setSimulationPlayerNum: (playerNum: number) => {
			set({ simulationPlayerNum: playerNum });
		},
		setSimulationResult: (result: SimulateResult[]) => {
			set({ simulationResult: result });
		},
		setIsSimulationLoading: (isLoading: boolean) => {
			set({ isSimulationLoading: isLoading });
		},
		setLobbyInfo: (lobbyInfo: LobbyInfo | null) => {
			set({ lobbyInfo });
		},
	};
};
