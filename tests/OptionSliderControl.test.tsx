import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionSliderControl } from "@/components/parts/OptionSliderControl";

describe("OptionSliderControl", () => {
	const defaultProps = {
		label: "Test Slider",
		selection: 1,
		values: [0, 10, 20, 30],
		onChange: vi.fn(),
	};

	it("renders label and current value correctly", async () => {
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} />);
		});
		expect(screen.getByText("Test Slider")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toHaveValue("10");
	});

	it("renders slider with correct initial value and aria-label", async () => {
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} />);
		});
		const slider = screen.getByRole("slider", { hidden: true });
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("aria-valuenow", "1");
		expect(slider).toHaveAttribute("aria-label", "Test Slider");
	});

	it("renders format when provided", async () => {
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} format="{0}s" />);
		});
		expect(screen.getByText("s")).toBeInTheDocument();
	});

	it("calls onChange when slider value changes", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} onChange={onChange} />);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		await act(async () => {
			fireEvent.change(slider, { target: { value: "2" } });
		});

		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("calls onChange with closest index when input is blurred", async () => {
		const onChange = vi.fn();
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} onChange={onChange} />);
		});

		const input = screen.getByRole("textbox");
		await act(async () => {
			fireEvent.change(input, { target: { value: "26" } });
			fireEvent.blur(input);
		});

		// 26 is closest to values[3] (30)
		expect(onChange).toHaveBeenCalledWith(3);
	});

	it("stops propagation when slider is changed", async () => {
		const onChange = vi.fn();
		const onParentClick = vi.fn();
		await act(async () => {
			render(
				// biome-ignore lint/a11y/noStaticElementInteractions: test
				<div onClick={onParentClick} onKeyDown={onParentClick}>
					<OptionSliderControl {...defaultProps} onChange={onChange} />
				</div>,
			);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		await act(async () => {
			fireEvent.change(slider, { target: { value: "2" } });
		});

		expect(onChange).toHaveBeenCalled();
		expect(onParentClick).not.toHaveBeenCalled();
	});

	it("stops propagation when clicked", async () => {
		const onParentClick = vi.fn();
		await act(async () => {
			render(
				// biome-ignore lint/a11y/noStaticElementInteractions: test
				<div onClick={onParentClick} onKeyDown={onParentClick}>
					<OptionSliderControl {...defaultProps} />
				</div>,
			);
		});

		const groups = screen.getAllByRole("group", { name: "Test Slider" });
		// The first one is the FieldSet
		await act(async () => {
			fireEvent.click(groups[0]);
		});

		expect(onParentClick).not.toHaveBeenCalled();
	});

	it("uses testId when provided", async () => {
		await act(async () => {
			render(<OptionSliderControl {...defaultProps} testId="custom-test-id" />);
		});
		expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
	});

	it("renders correctly without label", async () => {
		await act(async () => {
			render(
				<OptionSliderControl
					selection={defaultProps.selection}
					values={defaultProps.values}
					onChange={defaultProps.onChange}
				/>,
			);
		});
		expect(
			screen.queryByRole("group", { name: "Test Slider" }),
		).not.toBeInTheDocument();
		expect(screen.getByRole("slider", { hidden: true })).toHaveAttribute(
			"aria-label",
			"slider",
		);
	});
});
