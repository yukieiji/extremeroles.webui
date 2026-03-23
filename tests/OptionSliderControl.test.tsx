import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionSliderControl } from "../src/components/parts/OptionSliderControl";

describe("OptionSliderControl", () => {
	const mockValues = [10, 20, 30, 40, 50];
	const mockFormat = "{0}s";

	it("renders slider and input with correct initial value", () => {
		render(
			<OptionSliderControl
				selection={1}
				values={mockValues}
				format={mockFormat}
				onChange={() => {}}
			/>,
		);

		const slider = screen.getByRole("slider");
		expect(slider).toHaveValue("1");

		const input = screen.getByDisplayValue("20");
		expect(input).toBeInTheDocument();

		expect(screen.getByText("(20s)")).toBeInTheDocument();
	});

	it("calls onChange when slider moves", () => {
		const onChange = vi.fn();
		render(
			<OptionSliderControl
				selection={1}
				values={mockValues}
				format={mockFormat}
				onChange={onChange}
			/>,
		);

		const slider = screen.getByRole("slider");
		fireEvent.change(slider, { target: { value: "3" } });

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it("calls onChange with closest value when input changes", () => {
		const onChange = vi.fn();
		render(
			<OptionSliderControl
				selection={1}
				values={mockValues}
				format={mockFormat}
				onChange={onChange}
			/>,
		);

		const input = screen.getByDisplayValue("20");

		// 24 is closer to 20 (index 1)
		fireEvent.change(input, { target: { value: "24" } });
		expect(onChange).toHaveBeenCalledWith(1);

		// 26 is closer to 30 (index 2)
		fireEvent.change(input, { target: { value: "26" } });
		expect(onChange).toHaveBeenCalledWith(2);

		// 100 is closer to 50 (index 4)
		fireEvent.change(input, { target: { value: "100" } });
		expect(onChange).toHaveBeenCalledWith(4);
	});
});
