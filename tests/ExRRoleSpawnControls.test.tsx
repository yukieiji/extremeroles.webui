import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRRoleSpawnControls } from "../src/feature/ExRRoleSpawnControls";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import {
	getUniqueOptionId,
	parseUniqueOptionId,
} from "../src/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

function setUpudateExROptionSelectionSpawnRateMock(): void {
	// Mock updateExROptionSelection to update the store
	vi.spyOn(useStore.getState(), "updateExROptionSelection").mockImplementation(
		async (...args) => {
			args.forEach((x) => {
				const { optionId } = parseUniqueOptionId(x.uniqueOptionId);
				const values =
					optionId === SPAWN_RATE_OPTION_ID ? [0, 10, 20, 30] : [1, 2, 3];
				const currentStore = useStore.getState();
				currentStore.setExROptions(
					{
						...currentStore.exrValue,
						[x.uniqueOptionId]: { selection: x.selection, values },
					},
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
	};

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();
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

		// Set initial rate to 10%
		await useStore.getState().updateExROptionSelection({
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

		await fireEvent.change(slider, { target: { value: "0" } });

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

		await fireEvent.change(slider, { target: { value: "1" } }); // Select '1' (UI selection index 1 means backend selection 0)

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

		// Set initial rate to 10% and count to 2 (selection 1)
		await useStore.getState().updateExROptionSelection({
			uniqueOptionId: getUniqueOptionId(
				tabId,
				categoryId,
				SPAWN_RATE_OPTION_ID,
			),
			selection: 1,
		});
		await useStore.getState().updateExROptionSelection({
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

		await fireEvent.change(slider, { target: { value: "0" } });

		// Wait for potential async state updates
		await new Promise((resolve) => {
			return setTimeout(resolve, 100);
		});

		// UIが0を表示していることを確認
		const countDisplay = screen
			.getByTestId("spawn-count-control")
			.querySelector('input[type="text"]');
		expect(countDisplay).toHaveValue("0");
	});
});
