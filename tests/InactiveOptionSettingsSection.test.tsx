import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InactiveOptionSettingsSection } from "@/components/blocks/InactiveOptionSettingsSection";

describe("InactiveOptionSettingsSection", () => {
	it("renders dropdown trigger with current selection", () => {
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		expect(trigger).toHaveTextContent("非表示");
	});

	it("calls onUpdate with disabled when '操作だけ無効' is selected", async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		await user.click(trigger);

		const disabledOption = await screen.findByRole("option", {
			name: "操作だけ無効",
		});
		await user.click(disabledOption);

		await waitFor(() => {
			expect(onUpdate).toHaveBeenCalledWith("disabled");
		});
	});

	it("calls onUpdate with enabled when '操作可能' is selected", async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		const trigger = screen.getByRole("combobox");
		await user.click(trigger);

		const enabledOption = await screen.findByRole("option", {
			name: "操作可能",
		});
		await user.click(enabledOption);

		await waitFor(() => {
			expect(onUpdate).toHaveBeenCalledWith("enabled");
		});
	});
});
