import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RightFloatingPanel } from "../src/feature/RightFloatingPanel";
import { useStore } from "../src/useStore";

describe("RightFloatingPanel Component", () => {
	it("renders panel elements correctly", () => {
		useStore.setState({ isRightPanelOpen: true });
		render(<RightFloatingPanel />);

		expect(screen.getByText("Right Panel")).toBeInTheDocument();
		expect(screen.getByText("設定値")).toBeInTheDocument();
		expect(screen.getByText("AmongUsの設定")).toBeInTheDocument();
		expect(screen.getByText("ExRの設定")).toBeInTheDocument();
	});

	it("toggles panel visibility when toggle button is clicked", () => {
		useStore.setState({ isRightPanelOpen: false });
		render(<RightFloatingPanel />);

		const toggleButton = screen.getByLabelText("パネルを開く");
		fireEvent.click(toggleButton);

		expect(useStore.getState().isRightPanelOpen).toBe(true);
	});

	it("toggles accordions when clicked", () => {
		useStore.setState({
			isRightPanelOpen: true,
			isSettingsOpen: true,
			isAuSettingsOpen: true,
		});
		render(<RightFloatingPanel />);

		const auSettingsButton = screen.getByRole("button", {
			name: /AmongUsの設定/i,
		});
		fireEvent.click(auSettingsButton);

		expect(useStore.getState().isAuSettingsOpen).toBe(false);
	});

	it("closes panel when Escape key is pressed", () => {
		useStore.setState({ isRightPanelOpen: true });
		render(<RightFloatingPanel />);

		fireEvent.keyDown(window, { key: "Escape" });

		expect(useStore.getState().isRightPanelOpen).toBe(false);
	});
});
