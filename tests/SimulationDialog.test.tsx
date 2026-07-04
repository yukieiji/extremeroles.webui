import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import { SimulationDialog } from "@/feature/SimulationDialog";
import { postSimulate } from "@/logics/api";
import { useStore } from "@/useStore";

// APIのモック
vi.mock("@/logics/api", () => ({
	postSimulate: vi.fn(),
	translationMetaData: {},
}));

describe("SimulationDialog", () => {
	const mockTitle = "シミュレーション";

	const renderWithDialog = (ui: React.ReactElement) => {
		return render(
			<Dialog open={true}>
				{ui}
			</Dialog>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// ストアのリセット
		useStore.setState({
			simulationCycle: 1,
			simulationPlayerNum: 15,
			simulationResult: [],
			isSimulationLoading: false,
		});
	});

	it("renders dialog with title", () => {
		renderWithDialog(<SimulationDialog title={mockTitle} />);
		expect(screen.getByText(mockTitle)).toBeInTheDocument();
	});

	it("renders controls with default values", () => {
		renderWithDialog(<SimulationDialog title={mockTitle} />);

		expect(screen.getByText("Execute")).toBeInTheDocument();
		expect(screen.getByText("Cycle")).toBeInTheDocument();
		expect(screen.getByText("Player Num")).toBeInTheDocument();

		const inputs = screen.getAllByRole("spinbutton");
		expect(inputs[0]).toHaveValue(1); // Cycle
		expect(inputs[1]).toHaveValue(15); // Player Num
	});

	it("calls postSimulate when Execute button is clicked", async () => {
		const mockRes = [{ CycleData: [] }];
		(postSimulate as any).mockResolvedValue(mockRes);

		renderWithDialog(<SimulationDialog title={mockTitle} />);

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

	it("updates results in store after successful simulation", async () => {
		const mockRes = [
			{
				CycleData: [{ PlayerName: "P1", RoleName: "R1", Team: "T1" }]
			}
		];
		(postSimulate as any).mockResolvedValue(mockRes);

		renderWithDialog(<SimulationDialog title={mockTitle} />);

		fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

		await waitFor(() => {
			expect(useStore.getState().simulationResult).toEqual(mockRes);
		});

		expect(screen.getByText("結果 1")).toBeInTheDocument();
	});

	it("handles API error gracefully", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		(postSimulate as any).mockRejectedValue(new Error("API Error"));

		renderWithDialog(<SimulationDialog title={mockTitle} />);

		fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

		await waitFor(() => {
			expect(useStore.getState().simulationResult).toEqual([]);
		});

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("updates cycle value when slider changes", async () => {
		renderWithDialog(<SimulationDialog title={mockTitle} />);

		const cycleInput = screen.getAllByRole("spinbutton")[0];

		fireEvent.change(cycleInput, { target: { value: "50" } });
		fireEvent.blur(cycleInput);

		await waitFor(() => {
			expect(useStore.getState().simulationCycle).toBe(50);
		});
	});
});
