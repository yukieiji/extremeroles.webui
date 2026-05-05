import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleFilterViewer } from "../src/feature/rolefilter/RoleFilterViewer";
import { postRoleFilterUpdate } from "../src/logics/api";
import { useStore } from "../src/useStore";
import { PostExRAssignOps } from "../src/type";

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
			Op: PostExRAssignOps.FilterAssignNumIncrese,
			FilterId: guid,
			MapRoleId: null,
		});
		expect(screen.getByText("AssignNum: 6")).toBeInTheDocument();

		// Decrement
		await act(async () => {
			fireEvent.click(decrementButton);
		});

		expect(postRoleFilterUpdate).toHaveBeenCalledWith({
			Op: PostExRAssignOps.FilterAssignNumDecrese,
			FilterId: guid,
			MapRoleId: null,
		});
		expect(screen.getByText("AssignNum: 5")).toBeInTheDocument();
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
