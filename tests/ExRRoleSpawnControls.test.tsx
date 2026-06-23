import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRRoleSpawnControls } from "@/feature/exr/ExRRoleSpawnControls";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import { getUniqueOptionId, parseUniqueOptionId } from "@/logics/optionUtils";
import {
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
	type UpdateExRArg,
} from "@/type";
import { useStore } from "@/useStore";

vi.mock("@/logics/api.store", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/logics/api.store")>();
	return {
		...actual,
		useUpdateExROptionSelection: vi.fn(),
	};
});

function setUpudateExROptionSelectionSpawnRateMock(): void {
	// Mock useUpdateExROptionSelection to update the store
	vi.mocked(useUpdateExROptionSelection).mockReturnValue(
		async (...args: UpdateExRArg[]) => {
			act(() => {
				const currentStore = useStore.getState();
				const nextExrValue = { ...currentStore.exrValue };
				for (const x of args) {
					const { optionId } = parseUniqueOptionId(x.uniqueOptionId);
					const values =
						optionId === SPAWN_RATE_OPTION_ID ? [0, 10, 20, 30] : [1, 2, 3];
					nextExrValue[x.uniqueOptionId] = { selection: x.selection, values };
				}
				currentStore.setExROptions(
					nextExrValue,
					currentStore.isExROptionActive,
				);
			});
		},
	);
}

describe("ExRRoleSpawnControls", () => {
	const setupTestData = (tabId: number, categoryId: number) => {
		const rateUniqueId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_RATE_OPTION_ID,
		);
		const countUniqueId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_COUNT_OPTION_ID,
		);

		exrOptionMetaData.options[rateUniqueId] = {
			metaData: {
				translatedName: "レート",
				format: "{0}%",
				type: "Int32",
			},
			childOptionIds: [],
		};
		exrOptionMetaData.options[countUniqueId] = {
			metaData: {
				translatedName: "数",
				format: "{0}",
				type: "Int32",
			},
			childOptionIds: [],
		};

		act(() => {
			useStore.getState().setExROptions(
				{
					[rateUniqueId]: {
						selection: 0,
						values: [0, 10, 20, 30],
					},
					[countUniqueId]: {
						selection: 0,
						values: [1, 2, 3],
					},
				},
				{
					[rateUniqueId]: true,
					[countUniqueId]: true,
				},
			);
		});
	};

	beforeEach(() => {
		resetExrOptionMetaData();
		act(() => {
			useStore.getState().resetViewer();
		});
	});

	it("renders both controls", () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		expect(screen.getByTestId("spawn-rate-control")).toBeInTheDocument();
		expect(screen.getByTestId("spawn-count-control")).toBeInTheDocument();
	});

	it("handles virtual 0 for spawn count", () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		// Max should be 3 (virtual values: [0, 1, 2, 3] from backend [1, 2, 3])
		expect(slider.max).toBe("3");
	});

	it("syncs rate to 0 when count is set to 0", async () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		setUpudateExROptionSelectionSpawnRateMock();
		const updateExRSelection = useUpdateExROptionSelection();

		// Set initial rate to 10%
		await updateExRSelection({
			uniqueOptionId: getUniqueOptionId(
				tabId,
				categoryId,
				SPAWN_RATE_OPTION_ID,
			),
			selection: 1,
		});

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "0" } });
		});

		const state = useStore.getState();
		expect(
			state.exrValue[getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID)]
				.selection,
		).toBe(0); // Rate 0%
	});

	it("syncs rate to 10% when count is set to non-zero from zero rate", async () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		setUpudateExROptionSelectionSpawnRateMock();

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select '1' (UI selection index 1 means backend selection 0)
		});

		const state = useStore.getState();
		expect(
			state.exrValue[getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID)]
				.selection,
		).toBe(1); // Rate index 1 is 10%
	});

	it("syncs count to 0 when rate is set to 0%", async () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		setUpudateExROptionSelectionSpawnRateMock();
		const updateExRSelection = useUpdateExROptionSelection();

		// Set initial rate to 10% and count to 2 (selection 1)
		await updateExRSelection({
			uniqueOptionId: getUniqueOptionId(
				tabId,
				categoryId,
				SPAWN_RATE_OPTION_ID,
			),
			selection: 1,
		});
		await updateExRSelection({
			uniqueOptionId: getUniqueOptionId(
				tabId,
				categoryId,
				SPAWN_COUNT_OPTION_ID,
			),
			selection: 1,
		});

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const rateControl = screen.getByTestId("spawn-rate-control");
		const slider = rateControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "0" } });
		});

		// Wait for potential async state updates
		await new Promise((resolve) => {
			return setTimeout(resolve, 100);
		});

		// UIが0を表示していることを確認
		const countDisplay = screen
			.getByTestId("spawn-count-control")
			.querySelector('input[type="number"]');
		expect(countDisplay).toHaveValue(0);
	});

	it("opens accordion when rate becomes non-zero from 0%", async () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		setUpudateExROptionSelectionSpawnRateMock();

		useStore.getState().resetViewer();
		setupTestData(tabId, categoryId);

		expect(useStore.getState().openedExRCategoryIds[categoryId]).toBeFalsy();

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const rateControl = screen.getByTestId("spawn-rate-control");
		const slider = rateControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select 10%
		});

		expect(useStore.getState().openedExRCategoryIds[categoryId]).toBe(true);
	});

	it("opens accordion when count becomes non-zero from 0 rate", async () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		setUpudateExROptionSelectionSpawnRateMock();

		useStore.getState().resetViewer();
		setupTestData(tabId, categoryId);

		expect(useStore.getState().openedExRCategoryIds[categoryId]).toBeFalsy();

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } }); // Select 1
		});

		await waitFor(() => {
			const state = useStore.getState();
			expect(state.openedExRCategoryIds[categoryId]).toBe(true);
		});
	});
});
