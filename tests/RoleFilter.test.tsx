import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleFilterViewer } from "../src/feature/rolefilter/RoleFilterViewer";
import { postRoleFilterUpdate } from "../src/logics/api";
import { useStore } from "../src/useStore";

// Mock api.ts
vi.mock("../src/logics/api", () => ({
	postRoleFilterUpdate: vi.fn().mockResolvedValue(undefined),
	roleFilterMetaData: {
		FilterRoleId: [1, 2],
		NormalRoleId: { 1: "Crewmate", 2: "Impostor" },
		CombinationId: {},
		GhostRoleId: {},
	},
}));

describe("RoleFilterViewer and RoleFilterCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useStore.setState({
			roleFilterSet: {},
			blockDialog: undefined,
		});
	});

	it("renders empty state and adds a filter", async () => {
		render(<RoleFilterViewer />);

		expect(screen.getByText(/フィルターがありません/)).toBeInTheDocument();

		const addButton = screen.getByText("フィルターを追加");
		fireEvent.click(addButton);

		await waitFor(() => {
			expect(postRoleFilterUpdate).toHaveBeenCalled();
		});

		expect(screen.getByText("AssignNum: 1")).toBeInTheDocument();
	});

	it("deletes a filter with confirmation", async () => {
		const guid = "test-guid";
		useStore.setState({
			roleFilterSet: {
				[guid]: { AssignNum: 1, Roles: [] },
			},
		});

		render(<RoleFilterViewer />);

		const deleteButton = screen.getByLabelText("Delete filter");
		fireEvent.click(deleteButton);

		// Should show block dialog
		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("confirm");
		expect(state.blockDialog?.title).toBe("フィルターの削除");

		// Simulate confirm
		if (state.blockDialog?.type === "confirm") {
			await state.blockDialog.onConfirm();
		}

		expect(postRoleFilterUpdate).toHaveBeenCalled();
		expect(useStore.getState().roleFilterSet[guid]).toBeUndefined();
	});

	it("adds and removes roles with confirmation", async () => {
		const guid = "test-guid";
		useStore.setState({
			roleFilterSet: {
				[guid]: { AssignNum: 1, Roles: [] },
			},
		});

		render(<RoleFilterViewer />);

		// Add role
		const addRoleButton = screen.getByText("役職を追加");
		fireEvent.click(addRoleButton);

		let state = useStore.getState();
		expect(state.blockDialog?.type).toBe("roleSelect");

		// Simulate role selection
		if (state.blockDialog?.type === "roleSelect") {
			await state.blockDialog.onSelect(1);
		}

		expect(postRoleFilterUpdate).toHaveBeenCalled();
		expect(useStore.getState().roleFilterSet[guid].Roles).toContainEqual({
			id: 1,
			name: "Crewmate",
		});

		// Remove role
		const removeRoleButton = screen.getByLabelText("Remove Crewmate");
		fireEvent.click(removeRoleButton);

		state = useStore.getState();
		expect(state.blockDialog?.type).toBe("confirm");
		expect(state.blockDialog?.title).toBe("役職の削除");

		// Simulate confirm
		if (state.blockDialog?.type === "confirm") {
			await state.blockDialog.onConfirm();
		}

		expect(useStore.getState().roleFilterSet[guid].Roles).toEqual([]);
	});
});
