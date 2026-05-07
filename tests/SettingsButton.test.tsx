import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionGroupToggleSidebar } from "@/feature/OptionGroupToggleSidebar";
import { SETTINGS_TITLE } from "@/noTrans";
import { useStore } from "@/useStore";

// Lucideアイコンのモック
vi.mock("lucide-react", () => ({
	Settings: () => <div data-testid="settings-icon" />,
	ChevronLeft: () => <div data-testid="chevron-left-icon" />,
	ChevronRight: () => <div data-testid="chevron-right-icon" />,
}));

describe("OptionGroupToggleSidebar", () => {
	it("設定ボタンが表示されていること", () => {
		render(<OptionGroupToggleSidebar />);
		const settingsButton = screen.getByTitle(SETTINGS_TITLE);
		expect(settingsButton).toBeDefined();
		expect(screen.getByTestId("settings-icon")).toBeDefined();
	});

	it("設定ボタンをクリックするとダイアログが開くこと", () => {
		render(<OptionGroupToggleSidebar />);
		const settingsButton = screen.getByTitle(SETTINGS_TITLE);

		fireEvent.click(settingsButton);

		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("settings");
		expect(state.blockDialog?.title).toBe(SETTINGS_TITLE);
	});

	it("サイドバーが閉じているとき、設定ボタンのテキストが表示されないこと", () => {
		useStore.setState({ isSidebarOpen: false });
		render(<OptionGroupToggleSidebar />);

		const settingsButton = screen.getByTitle(SETTINGS_TITLE);
		expect(settingsButton.textContent).not.toContain(SETTINGS_TITLE);
	});

	it("サイドバーが開いているとき、設定ボタンのテキストが表示されること", () => {
		useStore.setState({ isSidebarOpen: true });
		render(<OptionGroupToggleSidebar />);

		const settingsButton = screen.getByTitle(SETTINGS_TITLE);
		expect(settingsButton.textContent).toContain(SETTINGS_TITLE);
	});
});
