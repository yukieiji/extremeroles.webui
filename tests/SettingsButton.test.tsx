import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptionGroupToggleSidebar } from "@/feature/OptionGroupToggleSidebar";
import { SETTINGS_TITLE } from "@/noTrans";
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
			<TooltipProvider>
				<SidebarProvider>
					<OptionGroupToggleSidebar />
				</SidebarProvider>
			</TooltipProvider>,
		);
		const settingsButton = screen.getByTestId("sidebar-settings-button");
		expect(settingsButton).toBeDefined();
		expect(screen.getByTestId("settings-icon")).toBeDefined();
	});

	it("設定ボタンをクリックするとダイアログが開くこと", () => {
		render(
			<TooltipProvider>
				<SidebarProvider>
					<OptionGroupToggleSidebar />
				</SidebarProvider>
			</TooltipProvider>,
		);
		const settingsButton = screen.getByTestId("sidebar-settings-button");

		fireEvent.click(settingsButton);

		const state = useStore.getState();
		expect(state.blockDialog).toBeDefined();
		expect(state.blockDialog?.type).toBe("settings");
		expect(state.blockDialog?.title).toBe(SETTINGS_TITLE);
	});


	it("サイドバーが開いているとき、設定ボタンのテキストが表示されること", () => {
		render(
			<TooltipProvider>
				<SidebarProvider defaultOpen={true}>
					<OptionGroupToggleSidebar />
				</SidebarProvider>
			</TooltipProvider>,
		);

		const settingsButton = screen.getByTestId("sidebar-settings-button");
		expect(settingsButton.textContent).toContain(SETTINGS_TITLE);
	});
});
