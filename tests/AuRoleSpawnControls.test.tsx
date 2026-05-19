import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuRoleSpawnControls } from "@/feature/amongus/AuRoleSpawnControls";
import { auOptionMetaData, resetAuOptionMetaData } from "@/logics/api";
import { useUpdateAuRoleOptionSelection } from "@/logics/api.store";
import type { AuOptionId, UpdateAuArg } from "@/type";
import { useStore } from "@/useStore";

vi.mock("@/logics/api.store", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/logics/api.store")>();
	return {
		...actual,
		useUpdateAuRoleOptionSelection: vi.fn(),
	};
});

describe("AuRoleSpawnControls", () => {
	const categoryId = 10;
	const chanceId = 100 as unknown as AuOptionId;
	const maxCountId = 200 as unknown as AuOptionId;

	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetViewer();

		// Mock useUpdateAuRoleOptionSelection to update the store
		vi.mocked(useUpdateAuRoleOptionSelection).mockReturnValue(
			async (chance: UpdateAuArg, maxCount: UpdateAuArg) => {
				useStore.getState().updateAuOptionSelection(chance, maxCount);
			},
		);

		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Role",
			options: [chanceId, maxCountId],
		};

		auOptionMetaData.options[chanceId] = {
			title: "Chance",
			format: "{0}%",
			range: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		};

		auOptionMetaData.options[maxCountId] = {
			title: "Max Count",
			format: "{0}",
			range: [0, 1, 2, 3, 4, 5],
		};

		useStore.getState().setAuValue({
			[chanceId]: 0,
			[maxCountId]: 0,
		});
	});

	it("renders both controls", async () => {
		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		expect(screen.getByTestId("spawn-rate-control")).toBeInTheDocument();
		expect(screen.getByTestId("spawn-count-control")).toBeInTheDocument();
	});

	it("syncs chance to 10% when max count is set to non-zero from zero", async () => {
		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select 1
		});

		await waitFor(() => {
			const state = useStore.getState();
			expect(state.auValue[chanceId]).toBe(1); // Index 1 is 10%
			expect(state.auValue[maxCountId]).toBe(1); // Index 1 is 1
		});
	});

	it("syncs chance to 0% when max count is set to 0", async () => {
		// Initial state: Chance 50% (index 5), Max Count 2 (index 2)
		useStore.getState().setAuValue({
			[chanceId]: 5,
			[maxCountId]: 2,
		});

		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "0" } });
		});

		await waitFor(() => {
			const state = useStore.getState();
			expect(state.auValue[chanceId]).toBe(0); // Index 0 is 0%
			expect(state.auValue[maxCountId]).toBe(0);
		});
	});

	it("syncs max count to 0 when chance is set to 0%", async () => {
		// Initial state: Chance 50% (index 5), Max Count 2 (index 2)
		useStore.getState().setAuValue({
			[chanceId]: 5,
			[maxCountId]: 2,
		});

		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const chanceControl = screen.getByTestId("spawn-rate-control");
		const slider = chanceControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "0" } });
		});

		await waitFor(() => {
			const state = useStore.getState();
			expect(state.auValue[chanceId]).toBe(0);
			expect(state.auValue[maxCountId]).toBe(0);
		});
	});

	it("closes accordion when chance becomes 0%", async () => {
		// Initial state: Open and Chance 10%
		useStore.getState().setAuValue({ [chanceId]: 1, [maxCountId]: 1 });
		useStore.getState().toggleAuCategory(categoryId);
		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(true);

		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const chanceControl = screen.getByTestId("spawn-rate-control");
		const slider = chanceControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "0" } });
		});

		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(false);
	});

	it("opens accordion when chance becomes non-zero from 0%", async () => {
		// Initial state: Closed and Chance 0%
		useStore.getState().setAuValue({ [chanceId]: 0, [maxCountId]: 0 });
		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBeFalsy();

		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const chanceControl = screen.getByTestId("spawn-rate-control");
		const slider = chanceControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select 10%
		});

		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(true);
	});

	it("opens accordion when max count becomes non-zero from 0", async () => {
		// Initial state: Closed and Chance 0%
		useStore.getState().setAuValue({ [chanceId]: 0, [maxCountId]: 0 });
		useStore.getState().setOpenedAuCategoryIds({}); // Ensure it's empty
		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBeFalsy();

		await act(async () => {
			render(<AuRoleSpawnControls categoryId={categoryId} />);
		});

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select 1
		});

		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(true);
	});
});
