import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InactiveOptionSettingsSection } from "@/components/blocks/InactiveOptionSettingsSection";

describe("InactiveOptionSettingsSection", () => {
	it("renders all inactive option display choices", () => {
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		expect(screen.getByRole("radio", { name: "非表示" })).toBeInTheDocument();
		expect(
			screen.getByRole("radio", { name: "操作だけ無効" }),
		).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "操作可能" })).toBeInTheDocument();
	});

	it("calls onUpdate with disabled when '操作だけ無効' is clicked", () => {
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		const disabledOption = screen.getByRole("radio", { name: "操作だけ無効" });
		fireEvent.click(disabledOption);

		expect(onUpdate).toHaveBeenCalledWith("disabled");
	});

	it("calls onUpdate with enabled when '操作可能' is clicked", () => {
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="hidden"
				onUpdate={onUpdate}
			/>,
		);

		const enabledOption = screen.getByRole("radio", { name: "操作可能" });
		fireEvent.click(enabledOption);

		expect(onUpdate).toHaveBeenCalledWith("enabled");
	});

	it("calls onUpdate with hidden when '非表示' is clicked", () => {
		const onUpdate = vi.fn();
		render(
			<InactiveOptionSettingsSection
				inactiveOptionDisplay="disabled"
				onUpdate={onUpdate}
			/>,
		);

		const hiddenOption = screen.getByRole("radio", { name: "非表示" });
		fireEvent.click(hiddenOption);

		expect(onUpdate).toHaveBeenCalledWith("hidden");
	});
});
