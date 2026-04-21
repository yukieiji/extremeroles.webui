import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuRoleSpawnControls } from "../src/feature/AuRoleSpawnControls";
import { auOptionMetaData, resetAuOptionMetaData } from "../src/logics/api";
import { useStore } from "../src/useStore";

describe("AuRoleSpawnControls", () => {
	const categoryId = 10;
	const chanceId = 100 as unknown as AuOptionId;
	const maxCountId = 200 as unknown as AuOptionId;

	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetViewer();

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

	it("renders both controls", () => {
		render(<AuRoleSpawnControls categoryId={categoryId} />);

		expect(screen.getByTestId("au-chance-control")).toBeInTheDocument();
		expect(screen.getByTestId("au-max-count-control")).toBeInTheDocument();
	});

	it("syncs chance to 10% when max count is set to non-zero from zero", () => {
		render(<AuRoleSpawnControls categoryId={categoryId} />);

		const countControl = screen.getByTestId("au-max-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "1" } }); // Select 1

		const state = useStore.getState();
		expect(state.auValue[chanceId]).toBe(1); // Index 1 is 10%
		expect(state.auValue[maxCountId]).toBe(1); // Index 1 is 1
	});

	it("syncs chance to 0% when max count is set to 0", () => {
		// Initial state: Chance 50% (index 5), Max Count 2 (index 2)
		useStore.getState().setAuValue({
			[chanceId]: 5,
			[maxCountId]: 2,
		});

		render(<AuRoleSpawnControls categoryId={categoryId} />);

		const countControl = screen.getByTestId("au-max-count-control");
		const slider = countControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		const state = useStore.getState();
		expect(state.auValue[chanceId]).toBe(0); // Index 0 is 0%
		expect(state.auValue[maxCountId]).toBe(0);
	});

	it("closes accordion when chance becomes 0%", () => {
		// Initial state: Open and Chance 10%
		useStore.getState().setAuValue({ [chanceId]: 1, [maxCountId]: 1 });
		useStore.getState().toggleAuCategory(categoryId);
		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(true);

		render(<AuRoleSpawnControls categoryId={categoryId} />);

		const chanceControl = screen.getByTestId("au-chance-control");
		const slider = chanceControl.querySelector(
			'input[type="range"]',
		) as HTMLInputElement;

		fireEvent.change(slider, { target: { value: "0" } });

		expect(useStore.getState().openedAuCategoryIds[categoryId]).toBe(false);
	});
});
