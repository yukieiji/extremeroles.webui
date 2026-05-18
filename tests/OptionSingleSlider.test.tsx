import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionSingleSlider } from "@/components/blocks/OptionSingleSlider";

describe("OptionSingleSlider", () => {
	const mockValues = [10, 20, 30, 40, 50];
	const mockFormat = "{0}s";
	const mockLabel = "Test Label";

	it("renders label, slider and input with correct initial value", async () => {
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={() => {}}
				/>,
			);
		});

		expect(screen.getByText(mockLabel)).toBeInTheDocument();

		const slider = screen.getByRole("slider", { hidden: true });
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("aria-valuenow", "1");

		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("20");

		expect(screen.getByText("s")).toBeInTheDocument();
	});

	it("calls onChange when slider moves", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		await act(async () => {
			fireEvent.change(slider, { target: { value: "3" } });
		});

		expect(onChange).toHaveBeenCalledWith(3);
	});

	it("calls onChange with closest value when input changes", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const input = screen.getByRole("textbox");

		// 24 is closer to 20 (index 1)
		await act(async () => {
			fireEvent.change(input, { target: { value: "24" } });
		});
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			fireEvent.blur(input);
		});
		expect(onChange).toHaveBeenCalledWith(1);

		// 26 is closer to 30 (index 2)
		await act(async () => {
			fireEvent.change(input, { target: { value: "26" } });
		});
		expect(onChange).toHaveBeenCalledTimes(1); // Not called yet for 26

		await act(async () => {
			fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
		});
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("allows clearing the input and then typing a new number", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const input = screen.getByRole("textbox");

		// Clear input
		await act(async () => {
			fireEvent.change(input, { target: { value: "" } });
		});
		expect(input).toHaveValue("");
		expect(onChange).not.toHaveBeenCalledWith(expect.any(Number));

		// Type "3"
		await act(async () => {
			fireEvent.change(input, { target: { value: "3" } });
		});
		expect(input).toHaveValue("3");
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			fireEvent.blur(input);
		});
		// 3 is closer to 10 (index 0)
		expect(onChange).toHaveBeenCalledWith(0);

		// Type "35"
		await act(async () => {
			fireEvent.change(input, { target: { value: "35" } });
		});
		expect(input).toHaveValue("35");
		expect(onChange).toHaveBeenCalledTimes(1);

		await act(async () => {
			fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
		});
		// 35 is closer to 30 (index 2) or 40 (index 3).
		// findClosestIndex:
		// 10: 25
		// 20: 15
		// 30: 5
		// 40: 5
		// It returns the first one with min diff, so 2.
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("resets input on blur if empty", async () => {
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1}
					values={mockValues}
					format={mockFormat}
					onChange={() => {}}
				/>,
			);
		});

		const input = screen.getByRole("textbox");

		await act(async () => {
			fireEvent.change(input, { target: { value: "" } });
		});
		expect(input).toHaveValue("");

		await act(async () => {
			fireEvent.blur(input);
		});
		expect(input).toHaveValue("20");
	});
});
