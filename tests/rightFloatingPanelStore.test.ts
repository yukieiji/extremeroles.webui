import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "../src/useStore";

describe("RightFloatingPanelStore", () => {
	beforeEach(() => {
		// ストアを初期状態にリセット
		useStore.setState({
			isRightPanelOpen: false,
			isSettingsOpen: true,
			isAuSettingsOpen: true,
			isExrSettingsOpen: true,
			rightPanelWidth: 320,
			isResizing: false,
		});
	});

	it("初期状態が正しいこと", () => {
		const state = useStore.getState();
		expect(state.isRightPanelOpen).toBe(false);
		expect(state.isSettingsOpen).toBe(true);
		expect(state.isAuSettingsOpen).toBe(true);
		expect(state.isExrSettingsOpen).toBe(true);
		expect(state.rightPanelWidth).toBe(320);
		expect(state.isResizing).toBe(false);
	});

	it("toggleRightPanel で isRightPanelOpen が切り替わること", () => {
		useStore.getState().toggleRightPanel();
		expect(useStore.getState().isRightPanelOpen).toBe(true);

		useStore.getState().toggleRightPanel();
		expect(useStore.getState().isRightPanelOpen).toBe(false);
	});

	it("setRightPanelOpen で isRightPanelOpen が変更されること", () => {
		useStore.getState().setRightPanelOpen(true);
		expect(useStore.getState().isRightPanelOpen).toBe(true);

		useStore.getState().setRightPanelOpen(false);
		expect(useStore.getState().isRightPanelOpen).toBe(false);
	});

	it("toggleSettings で isSettingsOpen が切り替わること", () => {
		useStore.getState().toggleSettings();
		expect(useStore.getState().isSettingsOpen).toBe(false);

		useStore.getState().toggleSettings();
		expect(useStore.getState().isSettingsOpen).toBe(true);
	});

	it("toggleAuSettings で isAuSettingsOpen が切り替わること", () => {
		useStore.getState().toggleAuSettings();
		expect(useStore.getState().isAuSettingsOpen).toBe(false);

		useStore.getState().toggleAuSettings();
		expect(useStore.getState().isAuSettingsOpen).toBe(true);
	});

	it("toggleExrSettings で isExrSettingsOpen が切り替わること", () => {
		useStore.getState().toggleExrSettings();
		expect(useStore.getState().isExrSettingsOpen).toBe(false);

		useStore.getState().toggleExrSettings();
		expect(useStore.getState().isExrSettingsOpen).toBe(true);
	});

	it("setRightPanelWidth で rightPanelWidth が変更されること", () => {
		useStore.getState().setRightPanelWidth(400);
		expect(useStore.getState().rightPanelWidth).toBe(400);
	});

	it("setIsResizing で isResizing が変更されること", () => {
		useStore.getState().setIsResizing(true);
		expect(useStore.getState().isResizing).toBe(true);

		useStore.getState().setIsResizing(false);
		expect(useStore.getState().isResizing).toBe(false);
	});
});
