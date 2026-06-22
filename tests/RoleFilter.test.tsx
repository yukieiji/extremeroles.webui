import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleFilterViewer } from "@/feature/rolefilter/RoleFilterViewer";
import { postRoleFilterUpdate } from "@/logics/api";
import { useStore } from "@/useStore";

// Mock api.ts
vi.mock("@/logics/api", () => ({
	postRoleFilterUpdate: vi.fn().mockResolvedValue(undefined),
	roleFilterMetaData: {
		FilterRoleId: [1, 2],
		NormalRoleId: { 1: "Crewmate", 2: "Impostor" },
		CombinationId: {},
		GhostRoleId: {},
	},
	translationMetaData: {},
}));

describe("RoleFilterViewer and RoleFilterCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		act(() => {
			useStore.setState({
				roleFilterSet: {},
				blockDialog: undefined,
			});
		});
	});

	it("renders empty state and triggers role selection on add filter", async () => {
		render(<RoleFilterViewer />);

		expect(screen.getByText(/フィルターがありません/)).toBeInTheDocument();

		const addButton = screen.getByText("フィルターを追加");
		await act(async () => {
			fireEvent.click(addButton);
		});

		// Should show role selection dialog instead of calling API immediately
		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("roleSelect");
		expect(state.blockDialog?.title).toBe("フィルター追加: 役職の選択");

		// Simulate role selection
		if (state.blockDialog?.type === "roleSelect") {
			await act(async () => {
				await state.blockDialog?.onSelect([1]);
			});
		}

		await waitFor(() => {
			// First call: FilterNewAdd, Second call: FilterRoleAdd
			expect(postRoleFilterUpdate).toHaveBeenCalledTimes(2);
		});

		expect(screen.getByText("AssignNum: 1")).toBeInTheDocument();
		expect(screen.getByText("Crewmate")).toBeInTheDocument();
	});

	it("deletes a filter with confirmation", async () => {
		const guid = "test-guid";
		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 1, Roles: [] },
				},
			});
		});

		render(<RoleFilterViewer />);

		// The delete button is the one with the 'X' icon
		const deleteButton = screen
			.getAllByRole("button")
			.find((btn) => btn.querySelector(".lucide-x"))!;
		await act(async () => {
			fireEvent.click(deleteButton);
		});

		// Should show block dialog
		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("confirm");
		expect(state.blockDialog?.title).toBe("フィルターの削除");

		// Simulate confirm
		if (state.blockDialog?.type === "confirm") {
			await act(async () => {
				await state.blockDialog?.onConfirm();
			});
		}

		expect(postRoleFilterUpdate).toHaveBeenCalled();
		expect(useStore.getState().roleFilterSet[guid]).toBeUndefined();
	});

	it("adds and removes roles with confirmation", async () => {
		const guid = "test-guid";
		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 1, Roles: [] },
				},
			});
		});

		render(<RoleFilterViewer />);

		// Add role
		const addRoleButton = screen.getByText("役職を追加");
		await act(async () => {
			fireEvent.click(addRoleButton);
		});

		let state = useStore.getState();
		expect(state.blockDialog?.type).toBe("roleSelect");

		// Simulate role selection
		if (state.blockDialog?.type === "roleSelect") {
			await act(async () => {
				await state.blockDialog?.onSelect([1]);
			});
		}

		expect(postRoleFilterUpdate).toHaveBeenCalled();
		expect(useStore.getState().roleFilterSet[guid].Roles).toContainEqual({
			id: 1,
			name: "Crewmate",
		});

		// Remove role
		const pins = screen.getAllByTestId("role-pin");
		const crewmatePin = pins.find((pin) => pin.textContent?.includes("Crewmate"))!;
		const removeRoleButton = crewmatePin.querySelector("button")!;
		await act(async () => {
			fireEvent.click(removeRoleButton);
		});

		state = useStore.getState();
		expect(state.blockDialog?.type).toBe("confirm");
		expect(state.blockDialog?.title).toBe("役職の削除");

		// Simulate confirm
		if (state.blockDialog?.type === "confirm") {
			await act(async () => {
				await state.blockDialog?.onConfirm();
			});
		}

		expect(useStore.getState().roleFilterSet[guid].Roles).toEqual([]);
	});
});
