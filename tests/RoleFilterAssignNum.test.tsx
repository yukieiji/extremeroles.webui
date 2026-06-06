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
import { PostExRAssignOps } from "@/type";
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
}));

describe("RoleFilter AssignNum Adjustment", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		act(() => {
			useStore.setState({
				roleFilterSet: {},
				blockDialog: undefined,
			});
		});
	});

	it("increments and decrements AssignNum", async () => {
		const guid = "test-guid";
		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 5, Roles: [] },
				},
				isUpdatingAssignNum: {},
			});
		});

		render(<RoleFilterViewer />);

		expect(screen.getByText("AssignNum: 5")).toBeInTheDocument();

		const incrementButton = screen.getByLabelText("Increment AssignNum");
		const decrementButton = screen.getByLabelText("Decrement AssignNum");

		// Increment
		await act(async () => {
			fireEvent.click(incrementButton);
		});

		expect(postRoleFilterUpdate).toHaveBeenCalledWith({
			Op: PostExRAssignOps.FilterAssignNumIncrease,
			FilterId: guid,
			MapRoleId: null,
		});
		expect(screen.getByText("AssignNum: 6")).toBeInTheDocument();

		// Decrement
		await act(async () => {
			fireEvent.click(decrementButton);
		});

		expect(postRoleFilterUpdate).toHaveBeenCalledWith({
			Op: PostExRAssignOps.FilterAssignNumDecrease,
			FilterId: guid,
			MapRoleId: null,
		});
		expect(screen.getByText("AssignNum: 5")).toBeInTheDocument();
	});

	it("disables buttons while updating", async () => {
		const guid = "test-guid";
		let resolveUpdate: (value: unknown) => void = () => {};
		vi.mocked(postRoleFilterUpdate).mockReturnValue(
			new Promise((resolve) => {
				resolveUpdate = resolve;
			}),
		);

		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 5, Roles: [] },
				},
				isUpdatingAssignNum: {},
			});
		});

		render(<RoleFilterViewer />);

		const incrementButton = screen.getByLabelText("Increment AssignNum");

		await act(async () => {
			fireEvent.click(incrementButton);
		});

		// Button should be disabled while promise is pending
		expect(incrementButton).toBeDisabled();

		await act(async () => {
			resolveUpdate();
		});

		await waitFor(() => {
			expect(incrementButton).not.toBeDisabled();
		});
	});

	it("disables decrement button at minimum value (1)", async () => {
		const guid = "test-guid";
		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 1, Roles: [] },
				},
			});
		});

		render(<RoleFilterViewer />);

		const decrementButton = screen.getByLabelText("Decrement AssignNum");
		expect(decrementButton).toBeDisabled();

		await act(async () => {
			fireEvent.click(decrementButton);
		});

		expect(postRoleFilterUpdate).not.toHaveBeenCalled();
		expect(screen.getByText("AssignNum: 1")).toBeInTheDocument();
	});

	it("disables increment button at maximum value (255)", async () => {
		const guid = "test-guid";
		act(() => {
			useStore.setState({
				roleFilterSet: {
					[guid]: { AssignNum: 255, Roles: [] },
				},
			});
		});

		render(<RoleFilterViewer />);

		const incrementButton = screen.getByLabelText("Increment AssignNum");
		expect(incrementButton).toBeDisabled();

		await act(async () => {
			fireEvent.click(incrementButton);
		});

		expect(postRoleFilterUpdate).not.toHaveBeenCalled();
		expect(screen.getByText("AssignNum: 255")).toBeInTheDocument();
	});
});
