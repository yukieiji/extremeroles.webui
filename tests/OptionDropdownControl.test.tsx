import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";

describe("OptionDropdownControl", () => {
	const mockValues = ["Option A", "Option B", "Option C"];

	it("renders dropdown with correct options", async () => {
		const user = userEvent.setup();
		render(
			<OptionDropdownControl
				selection={1}
				values={mockValues}
				onChange={() => {}}
				disabled={false}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		expect(trigger).toHaveTextContent("Option B");

		// Click to open
		await user.click(trigger);

		// Check options - wait for them to appear
		const options = await screen.findAllByRole("option");
		expect(options).toHaveLength(3);
		expect(options[0]).toHaveTextContent("Option A");
		expect(options[1]).toHaveTextContent("Option B");
		expect(options[2]).toHaveTextContent("Option C");
	});

	it("calls onChange when selection changes", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<OptionDropdownControl
				selection={1}
				values={mockValues}
				onChange={onChange}
				disabled={false}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		await user.click(trigger);

		const optionC = await screen.findByRole("option", { name: "Option C" });
		await user.click(optionC);

		await waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(2);
		});
	});
});
