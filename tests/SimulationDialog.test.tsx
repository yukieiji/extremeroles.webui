import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { Suspense } from "react";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import { SimulationDialog } from "@/feature/simulation/SimulationDialog";
import { postSimulate } from "@/logics/api";
import { getLobbyInfo } from "@/logics/api.store";
import { useStore } from "@/useStore";

const { mockedTranslationMetaData } = vi.hoisted(() => {
	return {
		mockedTranslationMetaData: {},
	};
});

// APIのモック
vi.mock("@/logics/api", () => ({
	postSimulate: vi.fn(),
	translationMetaData: mockedTranslationMetaData,
}));

Object.assign(mockedTranslationMetaData, {
	SIMULATE_LABEL: "シミュレート",
	SIMULATE_RESULT_HEADER: "シミュレート結果",
	SIMULATE_RESULT_TITLE: "結果",
	COPY_BUTTON_LABEL: "コピー",
	playerName: "プレイヤーネーム",
	roleName: "役職",
	SIMULATE_DETAILS_SETTING: "詳細設定",
	LOBBY_INFO_TITLE: "ロビー情報",
	CYCLE_LABEL: "Cycle",
	PLAYER_NUM_LABEL: "Player Num",
	EMPTY_SIMULATE_MESSAGE: "シミュレートボタンを押して下さい",
	SIMULATE_EXECUTING_LABEL: "Executing...",
	EXECUTE_BUTTON_LABEL: "Execute",
});

vi.mock("@/logics/api.store", () => ({
	getLobbyInfo: vi.fn(),
	resetLobbyInfoCache: vi.fn(),
}));

describe("SimulationDialog", () => {
	const mockTitle = "シミュレーション";

	const renderWithDialog = (ui: React.ReactElement) => {
		return render(
			<Dialog open={true}>
				<Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
			</Dialog>,
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(getLobbyInfo as Mock).mockResolvedValue(undefined);
		// ストアのリセット
		useStore.setState({
			simulationCycle: 1,
			simulationPlayerNum: 15,
			simulationResult: [],
			isSimulationLoading: false,
			lobbyInfo: {
				Online: null,
				CurrentPlayerNames: ["Lochbass"],
			},
		});
	});

	it("renders dialog with title", async () => {
		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});
		expect(screen.getByText(mockTitle)).toBeInTheDocument();
	});

	it("shows message when no results are present", () => {
		renderWithDialog(<SimulationDialog title={mockTitle} />);
		expect(
			screen.getByText("シミュレートボタンを押して下さい"),
		).toBeInTheDocument();
	});

	it("renders controls with default values", async () => {
		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});

		await waitFor(() => {
			expect(screen.getByText("ロビー情報")).toBeInTheDocument();
		});

		expect(screen.getByText("Cycle")).toBeInTheDocument();
		expect(screen.getByText("Execute")).toBeInTheDocument();
		expect(screen.getByText("Player Num")).toBeInTheDocument();

		const inputs = screen.getAllByRole("spinbutton");
		expect(inputs[0]).toHaveValue(1); // Cycle
		expect(inputs[1]).toHaveValue(15); // Player Num
	});

	it("calls postSimulate when Execute button is clicked", async () => {
		const mockRes = [{ CycleData: [] }];
		(postSimulate as Mock).mockResolvedValue(mockRes);

		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});

		await waitFor(() => {
			expect(screen.getByText("ロビー情報")).toBeInTheDocument();
		});

		const executeButton = screen.getByRole("button", { name: /Execute/i });
		fireEvent.click(executeButton);

		expect(executeButton).toBeDisabled();
		expect(screen.getByText("Executing...")).toBeInTheDocument();

		await waitFor(() => {
			expect(postSimulate).toHaveBeenCalledWith({
				Cycle: 1,
				Option: { PlayerNum: 15 },
				MockPlayerNames: null,
			});
		});

		await waitFor(() => {
			expect(executeButton).not.toBeDisabled();
			expect(screen.getByText("Execute")).toBeInTheDocument();
		});
	});

	it("shows loading indicator when simulation is in progress", async () => {
		(postSimulate as Mock).mockReturnValue(new Promise(() => {})); // Never resolves

		renderWithDialog(<SimulationDialog title={mockTitle} />);

		fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

		await waitFor(() => {
			expect(useStore.getState().isSimulationLoading).toBe(true);
		});

		// LoadingCycle has animate-spin class
		const resultArea = screen.getByText("Executing...").closest("div.flex-1");
		expect(resultArea?.querySelector(".animate-spin")).toBeInTheDocument();
		expect(
			screen.queryByText("シミュレートボタンを押して下さい"),
		).not.toBeInTheDocument();
	});

	it("updates results in store after successful simulation", async () => {
		const mockRes = [
			{
				CycleData: [{ PlayerName: "P1", RoleName: "R1", Team: "T1" }],
			},
		];
		(postSimulate as Mock).mockResolvedValue(mockRes);

		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});

		await waitFor(() => {
			expect(screen.getByText("ロビー情報")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

		await waitFor(() => {
			expect(useStore.getState().simulationResult).toEqual(mockRes);
		});

		expect(screen.getByText("結果 1")).toBeInTheDocument();
	});

	it("handles API error gracefully", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		(postSimulate as Mock).mockRejectedValue(new Error("API Error"));

		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});

		await waitFor(() => {
			expect(screen.getByText("ロビー情報")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

		await waitFor(() => {
			expect(useStore.getState().simulationResult).toEqual([]);
		});

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("updates cycle value when slider changes", async () => {
		await act(async () => {
			renderWithDialog(<SimulationDialog title={mockTitle} />);
		});

		await waitFor(() => {
			expect(screen.getByText("ロビー情報")).toBeInTheDocument();
		});

		const cycleInput = screen.getAllByRole("spinbutton")[0];

		fireEvent.change(cycleInput, { target: { value: "50" } });
		fireEvent.blur(cycleInput);

		await waitFor(() => {
			expect(useStore.getState().simulationCycle).toBe(50);
		});
	});
});
