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

	it("syncs rate to 0 when count is set to 0", async () => {
		const updateSpy = vi.spyOn(useStore.getState(), "updateExROptionSelection");

		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={{ ...spawnRateOption, Selection: 1 }} // Initial rate 10%
				spawnCountOption={spawnCountOption}
			/>,
		);

		const countControl = screen.getByTestId("spawn-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		expect(updateSpy).toHaveBeenCalledWith("1-51", 0);
		expect(updateSpy).toHaveBeenCalledWith("1-50", 0);
	});

	it("syncs rate to 10% when count is set to non-zero from zero rate", async () => {
		const updateSpy = vi.spyOn(useStore.getState(), "updateExROptionSelection");

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

		expect(updateSpy).toHaveBeenCalledWith("1-51", 0);
		expect(updateSpy).toHaveBeenCalledWith("1-50", 1);
	});

	it("syncs count to 0 when rate is set to 0%", async () => {
		const updateSpy = vi.spyOn(useStore.getState(), "updateExROptionSelection");

		render(
			<ExRRoleSpawnControls
				categoryId={1}
				spawnRateOption={{ ...spawnRateOption, Selection: 1 }} // Initial rate 10%
				spawnCountOption={{ ...spawnCountOption, Selection: 1 }} // Initial count 2
			/>,
		);

		const rateControl = screen.getByTestId("spawn-rate-control");
		const slider = rateControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		expect(updateSpy).toHaveBeenCalledWith("1-50", 0);
		expect(updateSpy).toHaveBeenCalledWith("1-51", 0);
	});
});
