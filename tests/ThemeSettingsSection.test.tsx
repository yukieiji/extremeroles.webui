import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeSettingsSection } from "@/components/blocks/ThemeSettingsSection";

describe("ThemeSettingsSection", () => {
	it("renders all theme options", () => {
		const onUpdate = vi.fn();
		render(<ThemeSettingsSection theme="system" onUpdate={onUpdate} />);

		expect(screen.getByRole("radio", { name: "システム" })).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "ライト" })).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "ダーク" })).toBeInTheDocument();
	});

	it("calls onUpdate with light when light is clicked", () => {
		const onUpdate = vi.fn();
		render(<ThemeSettingsSection theme="system" onUpdate={onUpdate} />);

		const lightOption = screen.getByRole("radio", { name: "ライト" });
		fireEvent.click(lightOption);

		expect(onUpdate).toHaveBeenCalledWith("light");
	});

	it("calls onUpdate with dark when dark is clicked", () => {
		const onUpdate = vi.fn();
		render(<ThemeSettingsSection theme="system" onUpdate={onUpdate} />);

		const darkOption = screen.getByRole("radio", { name: "ダーク" });
		fireEvent.click(darkOption);

		expect(onUpdate).toHaveBeenCalledWith("dark");
	});

	it("calls onUpdate with system when system is clicked", () => {
		const onUpdate = vi.fn();
		render(<ThemeSettingsSection theme="light" onUpdate={onUpdate} />);

		const systemOption = screen.getByRole("radio", { name: "システム" });
		fireEvent.click(systemOption);

		expect(onUpdate).toHaveBeenCalledWith("system");
	});
});
