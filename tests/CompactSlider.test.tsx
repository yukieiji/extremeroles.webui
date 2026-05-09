import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompactSlider } from "@/components/parts/CompactSlider";

describe("CompactSlider", () => {
	const defaultProps = {
		label: "Test Slider",
		currentSelection: 1,
		values: [0, 10, 20, 30],
		onSelectionChange: vi.fn(),
		onInputChange: vi.fn(),
	};

	it("renders label and current value correctly", async () => {
		await act(async () => {
			render(<CompactSlider {...defaultProps} />);
		});
		expect(screen.getByText("Test Slider")).toBeInTheDocument();
		expect(screen.getByDisplayValue("10")).toBeInTheDocument();
	});

	it("renders slider with correct initial value", async () => {
		await act(async () => {
			render(<CompactSlider {...defaultProps} />);
		});
		const slider = screen.getByRole("slider");
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveValue("1");
	});

	it("calls onSelectionChange when slider value changes", async () => {
		const onSelectionChange = vi.fn();
		await act(async () => {
			render(
				<CompactSlider {...defaultProps} onSelectionChange={onSelectionChange} />,
			);
		});

		const slider = screen.getByRole("slider");
		await act(async () => {
			fireEvent.change(slider, { target: { value: "2" } });
		});

		expect(onSelectionChange).toHaveBeenCalledWith(2);
	});

	it("calls onInputChange when input value changes", async () => {
		const onInputChange = vi.fn();
		await act(async () => {
			render(<CompactSlider {...defaultProps} onInputChange={onInputChange} />);
		});

		const input = screen.getByDisplayValue("10");
		await act(async () => {
			fireEvent.change(input, { target: { value: "25" } });
		});

		expect(onInputChange).toHaveBeenCalledWith(25);
	});
});
