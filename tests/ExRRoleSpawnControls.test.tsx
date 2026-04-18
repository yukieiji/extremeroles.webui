import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExRRoleSpawnControls } from "../src/feature/ExRRoleSpawnControls";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import type { ExROptionDto } from "../src/type";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRRoleSpawnControls", () => {
	const spawnRateOption: ExROptionDto = {
		Id: SPAWN_RATE_OPTION_ID,
		IsActive: true,
		TranslatedName: "レート",
		Selection: 0,
		Format: "{0}%",
		RangeMeta: { Type: "Int32", Values: [0, 10, 20, 30] },
		Childs: [],
	};

	const spawnCountOption: ExROptionDto = {
		Id: SPAWN_COUNT_OPTION_ID,
		IsActive: true,
		TranslatedName: "数",
		Selection: 0,
		Format: "",
		RangeMeta: { Type: "Int32", Values: [1, 2, 3] },
		Childs: [],
	};

	beforeEach(() => {
		useStore.getState().resetViewer();
	});

	it("renders both controls", () => {
		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={spawnRateOption}
				spawnCountOption={spawnCountOption}
			/>,
		);

		expect(screen.getByTestId("spawn-rate-control")).toBeInTheDocument();
		expect(screen.getByTestId("spawn-count-control")).toBeInTheDocument();
	});

	it("handles virtual 0 for spawn count", () => {
		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={spawnRateOption}
				spawnCountOption={spawnCountOption}
			/>,
		);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		// Max should be 3 (virtual values: [0, 1, 2, 3] from backend [1, 2, 3])
		expect(slider.max).toBe("3");
	});

	it("syncs rate to 0 when count is set to 0", () => {
		// Set initial rate to 10%
		const tabId = useStore.getState().selectedExRTabId;
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID),
				1,
			);

		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={spawnRateOption}
				spawnCountOption={spawnCountOption}
			/>,
		);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		const state = useStore.getState();
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)
			],
		).toBe(0); // Rate 0%
	});

	it("syncs rate to 10% when count is set to non-zero from zero rate", () => {
		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={spawnRateOption}
				spawnCountOption={spawnCountOption}
			/>,
		);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "1" } }); // Select '1'

		const state = useStore.getState();
		const tabId = state.selectedExRTabId;
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)
			],
		).toBe(1); // Rate index 1 is 10%
	});

	it("syncs count to 0 when rate is set to 0%", () => {
		// Set initial rate to 10% and count to 2
		const tabId = useStore.getState().selectedExRTabId;
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID),
				1,
			);
		useStore
			.getState()
			.TEMP_updateExROptionSelection(
				getUniqueOptionId(tabId, 1, SPAWN_COUNT_OPTION_ID),
				1,
			); // backend index 1 is value 2

		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={spawnRateOption}
				spawnCountOption={spawnCountOption}
			/>,
		);

		const rateControl = screen.getByTestId("spawn-rate-control");
		const slider = rateControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		const state = useStore.getState();
		expect(
			state.effectiveSelections[
				getUniqueOptionId(tabId, 1, SPAWN_COUNT_OPTION_ID)
			],
		).toBe(0); // Count reset to index 0

		// UI should show 0
		const countDisplay = screen
			.getByTestId("spawn-count-control")
			.querySelector('input[type="text"]');
		expect(countDisplay).toHaveValue("0");
	});
});
