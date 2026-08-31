import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionPairedSliderControl } from "@/components/blocks/OptionPairedSliderControl";

describe("OptionPairedSliderControl", () => {
	const minValues = [0, 5, 10, 15, 20];
	const maxValues = [0, 5, 10, 15, 20];
	const format = "{0}s";

	const onMinChange = vi.fn();
	const onMaxChange = vi.fn();

	it("renders both sliders and labels", async () => {
		await act(async () => {
			render(
				<OptionPairedSliderControl
					minSelection={1}
					maxSelection={3}
					minValues={minValues}
					maxValues={maxValues}
					format={format}
					onMinChange={onMinChange}
					onMaxChange={onMaxChange}
					minLabel="最小"
					maxLabel="最大"
					disabled={false}
				/>,
			);
		});

		expect(screen.getByText("最小")).toBeInTheDocument();
		expect(screen.getByText("最大")).toBeInTheDocument();

		const sliders = screen.getAllByRole("slider", { hidden: true });
		expect(sliders).toHaveLength(2);
		// Note: aria-valuenow might not be set immediately or might be set on a different element
		// if attribute check fails, we check the value of the underlying range input.
		expect(sliders[0]).toHaveValue("1");
		expect(sliders[1]).toHaveValue("3");

		// Values are displayed in inputs
		const inputs = screen.getAllByRole("spinbutton");
		expect(inputs.some((i) => (i as HTMLInputElement).value === "5")).toBe(
			true,
		);
		expect(inputs.some((i) => (i as HTMLInputElement).value === "15")).toBe(
			true,
		);
	});

	it("syncs max when min exceeds it", async () => {
		await act(async () => {
			render(
				<OptionPairedSliderControl
					minSelection={1}
					maxSelection={3}
					minValues={minValues}
					maxValues={maxValues}
					format={format}
					onMinChange={onMinChange}
					onMaxChange={onMaxChange}
					minLabel="Min"
					maxLabel="Max"
					disabled={false}
				/>,
			);
		});

		const sliders = screen.getAllByRole("slider", { hidden: true });
		// Usually min is first, max is second in DOM order
		const minSlider = sliders[0];

		// Move min to index 4 (value 20), which is greater than max (index 3, value 15)
		await act(async () => {
			fireEvent.change(minSlider, { target: { value: "4" } });
		});

		expect(onMinChange).toHaveBeenCalledWith(4);
		expect(onMaxChange).toHaveBeenCalledWith(4);
	});

	it("syncs min when max is less than it", async () => {
		await act(async () => {
			render(
				<OptionPairedSliderControl
					minSelection={1}
					maxSelection={3}
					minValues={minValues}
					maxValues={maxValues}
					format={format}
					onMinChange={onMinChange}
					onMaxChange={onMaxChange}
					minLabel="Min"
					maxLabel="Max"
				/>,
			);
		});

		const sliders = screen.getAllByRole("slider", { hidden: true });
		const maxSlider = sliders[1];

		// Move max to index 0 (value 0), which is less than min (index 1, value 5)
		await act(async () => {
			fireEvent.change(maxSlider, { target: { value: "0" } });
		});

		expect(onMaxChange).toHaveBeenCalledWith(0);
		expect(onMinChange).toHaveBeenCalledWith(0);
	});
});
