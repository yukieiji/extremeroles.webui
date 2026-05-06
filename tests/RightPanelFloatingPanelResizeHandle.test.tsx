import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RightPanelFloatingPanelResizeHandle } from "@/feature/rightsidepanel/RightPanelFloatingPanelResizeHandle";
import { useStore } from "@/useStore";

describe("RightPanelFloatingPanelResizeHandle Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset store state
		useStore.setState({
			isResizing: false,
			rightPanelWidth: 400,
		});
		// Mock window.innerWidth
		vi.stubGlobal("innerWidth", 1920);
		// Mock localStorage
		const localStorageMock = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			clear: vi.fn(),
			removeItem: vi.fn(),
		};
		vi.stubGlobal("localStorage", localStorageMock);
	});

	it("renders the resize handle element", () => {
		const { container } = render(<RightPanelFloatingPanelResizeHandle />);
		const handle = container.querySelector(".cursor-ew-resize");
		expect(handle).toBeInTheDocument();
	});

	it("sets isResizing to true on mouseDown", () => {
		const { container } = render(<RightPanelFloatingPanelResizeHandle />);
		const handle = container.querySelector(".cursor-ew-resize");

		if (!handle) {
			throw new Error("Handle not found");
		}
		fireEvent.mouseDown(handle);

		expect(useStore.getState().isResizing).toBe(true);
	});
});
