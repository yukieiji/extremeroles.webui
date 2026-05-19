import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { RightSidePanel } from "@/feature/rightsidepanel/RightSidePanel";
import { resetApiCache } from "@/logics/api.store";
import { useStore } from "@/useStore";

describe("RightSidePanel Component", () => {
	it("renders panel elements correctly", async () => {
		resetApiCache();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/exr/role/filter/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue({
							FilterSet: {},
							FilterRoleId: [],
							NormalRoleId: {},
							CombinationId: {},
							GhostRoleId: {},
						}),
					} as unknown as Response);
				}
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);

		useStore.setState({ isRightPanelOpen: true });
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightSidePanel />
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
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/exr/role/filter/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue({
							FilterSet: {},
							FilterRoleId: [],
							NormalRoleId: {},
							CombinationId: {},
							GhostRoleId: {},
						}),
					} as unknown as Response);
				}
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);

		useStore.setState({ isRightPanelOpen: false });
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightSidePanel />
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
			vi.fn().mockImplementation((input: RequestInfo | URL) => {
				const url = typeof input === "string" ? input : input.toString();
				if (url.includes("/exr/role/filter/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue({
							FilterSet: {},
							FilterRoleId: [],
							NormalRoleId: {},
							CombinationId: {},
							GhostRoleId: {},
						}),
					} as unknown as Response);
				}
				return Promise.resolve({
					ok: true,
					json: vi.fn().mockResolvedValue([]),
				} as unknown as Response);
			}),
		);

		useStore.setState({
			isRightPanelOpen: true,
			isSettingsOpen: true,
			isAuSettingsOpen: true,
		});
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<RightSidePanel />
				</Suspense>,
			);
		});

		const auSettingsButton = screen.getByRole("button", {
			name: /AmongUsの設定/i,
		});
		fireEvent.click(auSettingsButton);

		expect(useStore.getState().isAuSettingsOpen).toBe(false);
	});
});
