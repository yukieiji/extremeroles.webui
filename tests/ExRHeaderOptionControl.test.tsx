import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRHeaderOptionControl } from "@/feature/exr/ExRHeaderOptionControl";
import * as apiStore from "@/logics/api.store";
import { getUniqueOptionId } from "@/logics/optionUtils";
import type { ExROptionDto } from "@/type";
import { SPAWN_RATE_OPTION_ID } from "@/type";
import { useStore } from "@/useStore";

function setUpudateExROptionSelectionMock(values: (number | string)[]): void {
	vi.spyOn(apiStore, "useUpdateExROptionSelection").mockReturnValue(
		async (...args) => {
			const nextExrValue = { ...useStore.getState().exrValue };
			for (const x of args) {
				nextExrValue[x.uniqueOptionId] = {
					selection: x.selection,
					values: values,
				};
			}
			useStore
				.getState()
				.setExROptions(nextExrValue, useStore.getState().isExROptionActive);
		},
	);
}

describe("ExRHeaderOptionControl", () => {
	const mockOption: ExROptionDto = {
		Id: SPAWN_RATE_OPTION_ID,
		IsActive: true,
		TranslatedName: "レート",
		Selection: 0,
		Format: "{0}%",
		RangeMeta: { Type: "Int32", Values: [0, 50, 100] },
		Childs: [],
	};

	beforeEach(() => {
		useStore.getState().resetViewer();
	});

	it("renders correctly with given label and value", async () => {
		await act(async () => {
			render(
				<ExRHeaderOptionControl
					categoryId={1}
					option={mockOption}
					label="Rate"
				/>,
			);
		});

		expect(screen.getByText("Rate")).toBeInTheDocument();
		const slider = screen.getByRole("slider", { hidden: true });
		expect(slider).toHaveValue("0");

		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("0");
	});

	it("updates selection when slider is moved", async () => {
		// Mock updateExROptionSelection to update the store manually since there is no real API
		setUpudateExROptionSelectionMock(mockOption.RangeMeta.Values);

		await act(async () => {
			render(
				<ExRHeaderOptionControl
					categoryId={1}
					option={mockOption}
					label="Rate"
				/>,
			);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		await act(async () => {
			fireEvent.change(slider, { target: { value: "1" } });
		});

		// Check if store was updated
		const state = useStore.getState();
		const tabId = state.selectedExRTabId;
		expect(
			state.exrValue[getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)]
				.selection,
		).toBe(1);
	});

	it("updates selection when input is changed", async () => {
		setUpudateExROptionSelectionMock(mockOption.RangeMeta.Values);

		await act(async () => {
			render(
				<ExRHeaderOptionControl
					categoryId={1}
					option={mockOption}
					label="Rate"
				/>,
			);
		});

		const input = screen.getByRole("textbox");
		await act(async () => {
			fireEvent.change(input, { target: { value: "100" } });
		});

		const state = useStore.getState();
		const tabId = state.selectedExRTabId;
		expect(
			state.exrValue[getUniqueOptionId(tabId, 1, SPAWN_RATE_OPTION_ID)]
				.selection,
		).toBe(2); // 100 is at index 2
	});

	it("prevents click propagation to parent", async () => {
		const parentClick = vi.fn();
		await act(async () => {
			render(
				<button
					type="button"
					onClick={parentClick}
					onKeyDown={parentClick}
					aria-label="parent"
				>
					<ExRHeaderOptionControl
						categoryId={1}
						option={mockOption}
						label="Rate"
					/>
				</button>,
			);
		});

		const label = screen.getByText("Rate");
		await act(async () => {
			fireEvent.click(label);
		});

		expect(parentClick).not.toHaveBeenCalled();
	});
});
