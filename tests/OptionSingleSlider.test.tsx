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

	it("calls onChange with closest value when input changes and blurred", async () => {
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
		// Should not be called yet
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			fireEvent.blur(input);
		});
		expect(onChange).toHaveBeenCalledWith(1);

		// 26 is closer to 30 (index 2)
		await act(async () => {
			fireEvent.change(input, { target: { value: "26" } });
			fireEvent.keyDown(input, { key: "Enter" });
			fireEvent.blur(input);
		});
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("allows clearing input and then entering a value", async () => {
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

		await act(async () => {
			fireEvent.change(input, { target: { value: "" } });
		});
		expect(input).toHaveValue("");
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			fireEvent.change(input, { target: { value: "35" } });
			fireEvent.blur(input);
		});
		// 35 is between 30 (index 2) and 40 (index 3).
		// findClosestIndex: 30 - 35 = 5, 40 - 35 = 5. Ties usually take the first one or last one.
		// values = [10, 20, 30, 40, 50]
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("snaps input value back even if selection index doesn't change", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(
				<OptionSingleSlider
					label={mockLabel}
					selection={1} // Value is 20
					values={mockValues}
					format={mockFormat}
					onChange={onChange}
				/>,
			);
		});

		const input = screen.getByRole("textbox");

		// 21 is closest to 20 (index 1)
		await act(async () => {
			fireEvent.change(input, { target: { value: "21" } });
			fireEvent.blur(input);
		});

		// Selection index 1 didn't change, but input should snap back to "20"
		expect(onChange).toHaveBeenCalledWith(1);
		expect(input).toHaveValue("20");
	});
});
