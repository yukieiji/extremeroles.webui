import type { StateCreator } from "zustand";

/**
 * シミュレーションの状態を管理するスライスのインターフェース
 */
export interface SimulationSlice {
	simulationCycle: number;
	simulationPlayerNum: number;
	simulationResult: string;
	isSimulationLoading: boolean;
	setSimulationCycle: (cycle: number) => void;
	setSimulationPlayerNum: (playerNum: number) => void;
	setSimulationResult: (result: string) => void;
	setIsSimulationLoading: (isLoading: boolean) => void;
}

/**
 * シミュレーションの状態管理を行うスライスの生成
 */
export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => {
	return {
		simulationCycle: 1,
		simulationPlayerNum: 15,
		simulationResult: "",
		isSimulationLoading: false,
		setSimulationCycle: (cycle: number) => {
			set({ simulationCycle: cycle });
		},
		setSimulationPlayerNum: (playerNum: number) => {
			set({ simulationPlayerNum: playerNum });
		},
		setSimulationResult: (result: string) => {
			set({ simulationResult: result });
		},
		setIsSimulationLoading: (isLoading: boolean) => {
			set({ isSimulationLoading: isLoading });
		},
	};
};
