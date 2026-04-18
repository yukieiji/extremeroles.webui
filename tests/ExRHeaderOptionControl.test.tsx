import { fireEvent, render, screen, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRHeaderOptionControl } from "../src/feature/ExRHeaderOptionControl";
import { getInitialLoadPromise, resetApiCache } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import type { ExRTabDto } from "../src/type";
import { SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRHeaderOptionControl", () => {
	const mockTabs: ExRTabDto[] = [
		{
			Id: 0,
			Name: "General",
			Categories: [
				{
					Id: 1,
					Name: "Category 1",
					Options: [
						{
							Id: SPAWN_RATE_OPTION_ID,
							IsActive: true,
							TranslatedName: "レート",
							Selection: 0,
							Format: "{0}%",
							RangeMeta: { Type: "Int32", Values: [0, 50, 100] },
							Childs: [],
						},
					],
				},
			],
		},
	];

	beforeEach(async () => {
		resetApiCache();
		useStore.getState().resetViewer();
		vi.stubGlobal(
			"fetch",
			vi.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockTabs),
				}),
			),
		);
		await act(async () => {
			await getInitialLoadPromise();
		});
	});

	it("renders correctly with given label and value", () => {
		render(
			<ExRHeaderOptionControl
				categoryId={1}
				optionId={SPAWN_RATE_OPTION_ID}
				label="Rate"
			/>,
		);

		expect(screen.getByText("Rate")).toBeInTheDocument();
		expect(screen.getByRole("slider")).toHaveValue("0");

		const inputs = screen.getAllByDisplayValue("0");
		const textInput = inputs.find(
			(i) => (i as HTMLInputElement).type === "text",
		);
		expect(textInput).toBeInTheDocument();
	});

	it("updates selection when slider is moved", () => {
		render(
			<ExRHeaderOptionControl
				categoryId={1}
				optionId={SPAWN_RATE_OPTION_ID}
				label="Rate"
			/>,
		);

		const slider = screen.getByRole("slider");
		fireEvent.change(slider, { target: { value: "1" } });

		// Check if store was updated
		const state = useStore.getState();
		const tabId = state.selectedExRTabId;
		expect(
			state.valueData[getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)].selection,
		).toBe(1);
	});

	it("updates selection when input is changed", () => {
		render(
			<ExRHeaderOptionControl
				categoryId={1}
				optionId={SPAWN_RATE_OPTION_ID}
				label="Rate"
			/>,
		);

		const inputs = screen.getAllByDisplayValue("0");
		const textInput = inputs.find(
			(i) => (i as HTMLInputElement).type === "text",
		);
		if (!textInput) {
			throw new Error("Text input not found");
		}

		fireEvent.change(textInput, { target: { value: "100" } });

		const state = useStore.getState();
		const tabId = state.selectedExRTabId;
		expect(
			state.valueData[getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)].selection,
		).toBe(2); // 100 is at index 2
	});

	it("prevents click propagation to parent", () => {
		const parentClick = vi.fn();
		render(
			<button
				type="button"
				onClick={parentClick}
				onKeyDown={parentClick}
				aria-label="parent"
			>
				<ExRHeaderOptionControl
					categoryId={1}
					optionId={SPAWN_RATE_OPTION_ID}
					label="Rate"
				/>
			</button>,
		);

		const label = screen.getByText("Rate");
		fireEvent.click(label);

		expect(parentClick).not.toHaveBeenCalled();
	});
});
