import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExRRoleSpawnControls } from "../src/feature/ExRRoleSpawnControls";
import type { ExROptionDto } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRRoleSpawnControls", () => {
	const spawnRateOption: ExROptionDto = {
		Id: 50,
		IsActive: true,
		TranslatedName: "レート",
		Selection: 0,
		Format: "{0}%",
		RangeMeta: { Type: "Int32", Values: [0, 10, 20, 30] },
		Childs: [],
	};

	const spawnCountOption: ExROptionDto = {
		Id: 51,
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
		useStore.getState().updateExROptionSelection("1-50", 1);

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
		expect(state.effectiveSelections["1-50"]).toBe(0); // Rate 0%
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
		expect(state.effectiveSelections["1-50"]).toBe(1); // Rate index 1 is 10%
	});

	it("syncs count to 0 when rate is set to 0%", () => {
		// Set initial rate to 10% and count to 2
		useStore.getState().updateExROptionSelection("1-50", 1);
		useStore.getState().updateExROptionSelection("1-51", 1); // backend index 1 is value 2

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
		expect(state.effectiveSelections["1-51"]).toBe(0); // Count reset to index 0

		// UI should show 0
		const countDisplay = screen
			.getByTestId("spawn-count-control")
			.querySelector('input[type="text"]');
		expect(countDisplay).toHaveValue("0");
	});
});
