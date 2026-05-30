import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select, SelectTrigger } from "@/components/ui/select";
import { PresetDropdown } from "@/feature/exr/PresetDropdown";
import { useStore } from "@/useStore";

vi.mock("@/useStore");

describe("PresetDropdown", () => {
	it("renders preset items correctly", async () => {
		const user = userEvent.setup();
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: { 0: "Custom Name" },
			}),
		);

		render(
			<Select>
				<SelectTrigger>Open</SelectTrigger>
				<PresetDropdown presetValues={[123, 456]} />
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));

		const options = await screen.findAllByRole("option");
		expect(options).toHaveLength(2);

		// Check if Custom Name (for index 0) is rendered
		expect(screen.getByText("Custom Name")).toBeInTheDocument();
		// Check if original value is rendered in parenthesis
		expect(screen.getByText("(123)")).toBeInTheDocument();
		// Check if the other preset (index 1) is rendered as its value
		expect(screen.getByText("456")).toBeInTheDocument();
	});

	it("calls onValueChange when an item is selected", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: {},
			}),
		);

		render(
			<Select onValueChange={onValueChange}>
				<SelectTrigger>Open</SelectTrigger>
				<PresetDropdown presetValues={[123, 456]} />
			</Select>,
		);

		await user.click(screen.getByRole("combobox"));

		const option2 = await screen.findByRole("option", { name: "456" });
		await user.click(option2);

		expect(onValueChange).toHaveBeenCalledWith("1", expect.anything());
	});
});
