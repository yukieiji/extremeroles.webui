import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionToggleControl } from "../src/components/parts/OptionToggleControl";

describe("OptionToggleControl", () => {
	const mockValues = [
		"<color=#FF0000>OFF</color>",
		"<color=#00FF00>ON</color>",
	];

	it("renders toggle switch with correct selection text", () => {
		render(
			<OptionToggleControl
				selection={0}
				values={mockValues}
				onChange={() => {}}
			/>,
		);

		// ColoredText handles the tags, so we check for the text content
		expect(screen.getByText("OFF")).toBeInTheDocument();

		const toggle = screen.getByRole("switch");
		expect(toggle).toHaveAttribute("aria-checked", "false");
	});

	it("renders ON state correctly", () => {
		render(
			<OptionToggleControl
				selection={1}
				values={mockValues}
				onChange={() => {}}
			/>,
		);

		expect(screen.getByText("ON")).toBeInTheDocument();

		const toggle = screen.getByRole("switch");
		expect(toggle).toHaveAttribute("aria-checked", "true");
	});

	it("calls onChange when clicked", () => {
		const onChange = vi.fn();
		render(
			<OptionToggleControl
				selection={0}
				values={mockValues}
				onChange={onChange}
			/>,
		);

		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);

		expect(onChange).toHaveBeenCalledWith(1);
	});

	it("calls onChange(0) when clicked while ON", () => {
		const onChange = vi.fn();
		render(
			<OptionToggleControl
				selection={1}
				values={mockValues}
				onChange={onChange}
			/>,
		);

		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);

		expect(onChange).toHaveBeenCalledWith(0);
	});

	it("does not call onChange when disabled", () => {
		const onChange = vi.fn();
		render(
			<OptionToggleControl
				selection={0}
				values={mockValues}
				onChange={onChange}
				disabled={true}
			/>,
		);

		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);

		expect(onChange).not.toHaveBeenCalled();
	});
});
