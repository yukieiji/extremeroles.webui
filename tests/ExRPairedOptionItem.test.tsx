import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRPairedOptionItem } from "@/feature/exr/ExRPairedOptionItem";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import * as apiStore from "@/logics/api.store";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

describe("ExRPairedOptionItem", () => {
	const minUniqueId = getUniqueOptionId(1, 1, 10);
	const maxUniqueId = getUniqueOptionId(1, 1, 11);

	const minData = {
		uniqueOptionId: minUniqueId,
		metaData: {
			translatedName: "Test 最小",
			format: "{0}s",
			type: "Int32",
		},
		label: "最小",
	};

	const maxData = {
		uniqueOptionId: maxUniqueId,
		metaData: {
			translatedName: "Test 最大",
			format: "{0}s",
			type: "Int32",
		},
		label: "最大",
	};

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// Setup metadata
		exrOptionMetaData.options[minUniqueId] = {
			metaData: minData.metaData,
			childOptionIds: [],
		};
		exrOptionMetaData.options[maxUniqueId] = {
			metaData: maxData.metaData,
			childOptionIds: [],
		};

		// Setup store state
		useStore.getState().setExROptions(
			{
				[minUniqueId]: { selection: 2, values: [0, 1, 2, 3, 4, 5] },
				[maxUniqueId]: { selection: 4, values: [0, 1, 2, 3, 4, 5] },
			},
			{
				[minUniqueId]: true,
				[maxUniqueId]: true,
			},
		);
	});

	it("renders base name and current values", () => {
		render(
			<ExRPairedOptionItem
				baseName="Test"
				minData={minData}
				maxData={maxData}
			/>,
		);

		expect(screen.getByText("Test")).toBeInTheDocument();
		// In OptionPairedSliderControl, it might render labels and values
		expect(screen.getByText("最小")).toBeInTheDocument();
		expect(screen.getByText("最大")).toBeInTheDocument();

		// Check if current values (formatted) are displayed
		// 2nd index of [0,1,2,3,4,5] is 2, formatted as "2s"
		// 4th index is 4, formatted as "4s"
		// Both text input and range input have the same value, so we use getAllByDisplayValue
		expect(screen.getAllByDisplayValue("2")).toHaveLength(2);
		expect(screen.getAllByDisplayValue("4")).toHaveLength(2);
	});

	it("calls updateExROptionSelection when min value changes", async () => {
		const updateMock = vi.fn();
		vi.spyOn(apiStore, "useUpdateExROptionSelection").mockReturnValue(
			updateMock,
		);

		render(
			<ExRPairedOptionItem
				baseName="Test"
				minData={minData}
				maxData={maxData}
			/>,
		);

		// Find the min slider by its label
		const sliders = screen.getAllByRole("slider", { hidden: true });
		const minSlider = sliders[0];

		fireEvent.change(minSlider, { target: { value: "3" } });

		expect(updateMock).toHaveBeenCalledWith({
			uniqueOptionId: minUniqueId,
			selection: 3,
		});
	});

	it("calls updateExROptionSelection when max value changes", async () => {
		const updateMock = vi.fn();
		vi.spyOn(apiStore, "useUpdateExROptionSelection").mockReturnValue(
			updateMock,
		);

		render(
			<ExRPairedOptionItem
				baseName="Test"
				minData={minData}
				maxData={maxData}
			/>,
		);

		// Find the max slider by its label
		const sliders = screen.getAllByRole("slider", { hidden: true });
		const maxSlider = sliders[1];

		fireEvent.change(maxSlider, { target: { value: "5" } });

		expect(updateMock).toHaveBeenCalledWith({
			uniqueOptionId: maxUniqueId,
			selection: 5,
		});
	});
});
