import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExRRoleSpawnControls } from "../src/feature/ExRRoleSpawnControls";
import { exrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

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

		exrOptionMetaData.optionMetaData[rateUniqueId] = {
			translatedName: "レート",
			format: "{0}%",
			type: "Int32",
		};
		exrOptionMetaData.optionMetaData[countUniqueId] = {
			translatedName: "数",
			format: "{0}",
			type: "Int32",
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

	it("syncs rate to 0 when count is set to 0", () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		// Set initial rate to 10%
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID),
				1,
			);

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		const state = useStore.getState();
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID)
			],
		).toBe(0); // Rate 0%
	});

	it("syncs rate to 10% when count is set to non-zero from zero rate", () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "1" } }); // Select '1' (UI selection index 1 means backend selection 0)

		const state = useStore.getState();
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID)
			],
		).toBe(1); // Rate index 1 is 10%
	});

	it("syncs count to 0 when rate is set to 0%", () => {
		const tabId = 1;
		const categoryId = 1;
		setupTestData(tabId, categoryId);

		// Set initial rate to 10% and count to 2 (selection 1)
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID),
				1,
			);
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, categoryId, SPAWN_COUNT_OPTION_ID),
				1,
			);

		render(<ExRRoleSpawnControls tabId={tabId} categoryId={categoryId} />);

		const rateControl = screen.getByTestId("spawn-rate-control");
		const slider = rateControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		const state = useStore.getState();
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, categoryId, SPAWN_COUNT_OPTION_ID)
			],
		).toBe(0); // Count reset to index 0

		// UI should show 0
		const countDisplay = screen
			.getByTestId("spawn-count-control")
			.querySelector('input[type="text"]');
		expect(countDisplay).toHaveValue("0");
	});
});
