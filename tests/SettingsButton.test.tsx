import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OptionGroupToggleSidebar } from "@/feature/OptionGroupToggleSidebar";
import { translationMetaData } from "@/logics/api";
import { useStore } from "@/useStore";

// Lucideアイコンのモック
vi.mock("lucide-react", () => ({
	Settings: () => <div data-testid="settings-icon" />,
	PanelLeftIcon: () => <div data-testid="panel-left-icon" />,
}));

describe("OptionGroupToggleSidebar", () => {
	beforeAll(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(), // deprecated
				removeListener: vi.fn(), // deprecated
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	it("設定ボタンが表示されていること", () => {
		render(
			<SidebarProvider>
				<OptionGroupToggleSidebar />
			</SidebarProvider>,
		);
		const settingsButton = screen.getByTestId("sidebar-settings-button");
		expect(settingsButton).toBeDefined();
		expect(screen.getByTestId("settings-icon")).toBeDefined();
	});

	it("設定ボタンをクリックするとダイアログが開くこと", () => {
		render(
			<SidebarProvider>
				<OptionGroupToggleSidebar />
			</SidebarProvider>,
		);
		const settingsButton = screen.getByTestId("sidebar-settings-button");

		fireEvent.click(settingsButton);

		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("settings");
		expect(state.blockDialog?.title).toBe(translationMetaData.SettingsLabel);
	});

	it("サイドバーが開いているとき、設定ボタンのテキストが表示されること", () => {
		render(
			<SidebarProvider defaultOpen={true}>
				<OptionGroupToggleSidebar />
			</SidebarProvider>,
		);

		const settingsButton = screen.getByTestId("sidebar-settings-button");
		expect(settingsButton.textContent).toContain(
			translationMetaData.SettingsLabel,
		);
	});
});
