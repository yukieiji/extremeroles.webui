import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { RightFloatingPanel } from "../src/feature/rightsidepanel/RightFloatingPanel";
import { getAllOptions, resetApiCache } from "../src/logics/api.store";
import { useStore } from "../src/useStore";

describe("RightFloatingPanel Component", () => {
	it("renders panel elements correctly", async () => {
		resetApiCache();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((_input: RequestInfo | URL) => {
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);
		await getAllOptions();

		useStore.setState({ isRightPanelOpen: true });
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightFloatingPanel />
				</Suspense>,
			);
		});

		expect(screen.getByText("Right Panel")).toBeInTheDocument();
		expect(screen.getByText("設定値")).toBeInTheDocument();
		expect(screen.getByText("AmongUsの設定")).toBeInTheDocument();
		expect(screen.getByText("ExRの設定")).toBeInTheDocument();
	});

	it("toggles panel visibility when toggle button is clicked", async () => {
		resetApiCache();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((_input: RequestInfo | URL) => {
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);
		await getAllOptions();

		useStore.setState({ isRightPanelOpen: false });
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightFloatingPanel />
				</Suspense>,
			);
		});

		const toggleButton = screen.getByLabelText("パネルを開く");
		fireEvent.click(toggleButton);

		expect(useStore.getState().isRightPanelOpen).toBe(true);
	});

	it("toggles accordions when clicked", async () => {
		resetApiCache();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((_input: RequestInfo | URL) => {
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);
		await getAllOptions();

		useStore.setState({
			isRightPanelOpen: true,
			isSettingsOpen: true,
			isAuSettingsOpen: true,
		});
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightFloatingPanel />
				</Suspense>,
			);
		});

		const auSettingsButton = screen.getByRole("button", {
			name: /AmongUsの設定/i,
		});
		fireEvent.click(auSettingsButton);

		expect(useStore.getState().isAuSettingsOpen).toBe(false);
	});

	it("closes panel when Escape key is pressed", async () => {
		resetApiCache();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((_input: RequestInfo | URL) => {
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);
		await getAllOptions();

		useStore.setState({ isRightPanelOpen: true });
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightFloatingPanel />
				</Suspense>,
			);
		});

		fireEvent.keyDown(window, { key: "Escape" });

		expect(useStore.getState().isRightPanelOpen).toBe(false);
	});
});
