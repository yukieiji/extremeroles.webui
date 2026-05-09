import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionSliderControl } from "@/components/blocks/OptionSliderControl";

describe("OptionSliderControl", () => {
	const mockValues = [10, 20, 30, 40, 50];
	const mockFormat = "{0}s";

	it("renders slider and input with correct initial value", async () => {
		await act(async () => {
			render(
				<OptionSliderControl
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={() => {}}
				/>,
			);
		});

		// shadcn/ui (Base UI) Slider uses a hidden input for the value
		const slider = screen.getByDisplayValue("1");
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("type", "range");

		const input = screen.getByDisplayValue("20");
		expect(input).toBeInTheDocument();

		expect(screen.getByText("s")).toBeInTheDocument();
	});

	it("calls onChange when slider moves", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSliderControl
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const slider = screen.getByDisplayValue("1");
		await act(async () => {
			fireEvent.change(slider, { target: { value: "3" } });
		});

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it("calls onChange with closest value when input changes", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSliderControl
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const input = screen.getByDisplayValue("20");

		// 24 is closer to 20 (index 1)
		await act(async () => {
			fireEvent.change(input, { target: { value: "24" } });
		});
		expect(onChange).toHaveBeenCalledWith(1);

		// 26 is closer to 30 (index 2)
		await act(async () => {
			fireEvent.change(input, { target: { value: "26" } });
		});
		expect(onChange).toHaveBeenCalledWith(2);

		// 100 is closer to 50 (index 4)
		await act(async () => {
			fireEvent.change(input, { target: { value: "100" } });
		});
		expect(onChange).toHaveBeenCalledWith(4);
	});
});
