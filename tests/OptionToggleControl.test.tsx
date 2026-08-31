import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionToggleControl } from "@/components/blocks/OptionToggleControl";

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
				disabled={false}
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
				disabled={false}
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
				disabled={false}
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
				disabled={false}
			/>,
		);

		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);

		expect(onChange).toHaveBeenCalledWith(0);
	});
});
