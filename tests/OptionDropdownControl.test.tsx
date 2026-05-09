import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";

describe("OptionDropdownControl", () => {
	const mockValues = ["Option A", "Option B", "Option C"];

	it("renders dropdown with correct options", async () => {
		render(
			<OptionDropdownControl
				selection="Option B"
				values={mockValues}
				onChange={() => {}}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		expect(trigger).toHaveTextContent("Option B");

		// Click to open
		await userEvent.click(trigger);

		// Check options
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);
		expect(options[0]).toHaveTextContent("Option A");
		expect(options[1]).toHaveTextContent("Option B");
		expect(options[2]).toHaveTextContent("Option C");
	});

	it("calls onChange when selection changes", async () => {
		const onChange = vi.fn();
		render(
			<OptionDropdownControl
				selection="Option B"
				values={mockValues}
				onChange={onChange}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		await userEvent.click(trigger);

		const optionC = screen.getByRole("option", { name: "Option C" });
		await userEvent.click(optionC);

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith("Option C");
		});
	});
});
