import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PresetSelector } from "@/feature/exr/PresetSelector";
import { useOptionData } from "@/hooks/useExROptionData";
import { updateExrOption } from "@/logics/api";
import { useStore } from "@/useStore";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/useStore");
vi.mock("@/logics/api");
vi.mock("@/hooks/useBackend", () => ({
	useBackendUpdate: () => vi.fn((callback: () => Promise<void>) => callback()),
}));

// Mock Select component to avoid JSDOM issues with portals/Radix
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		onValueChange,
		value,
	}: {
		children: ReactNode;
		onValueChange: (v: string) => void;
		value: string;
	}) => (
		<button
			type="button"
			data-testid="mock-select"
			data-value={value}
			onClick={() => onValueChange("1")}
		>
			{children}
		</button>
	),
	SelectTrigger: ({
		className,
		children,
		...props
	}: {
		className?: string;
		children?: ReactNode;
	}) => (
		<span className={className} {...props}>
			{children}
		</span>
	),
	SelectContent: ({ children }: { children: ReactNode }) => (
		<div data-testid="select-content">{children}</div>
	),
	SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
		<div data-testid={`select-item-${value}`} data-value={value}>
			{children}
		</div>
	),
	SelectValue: ({ children }: { children?: ReactNode }) => (
		<span>{children}</span>
	),
}));

describe("PresetSelector", () => {
	const mockUpdatePresetName = vi.fn();
	const mockOpenBlockDialog = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: { 0: "Preset 1", 1: "Preset 2" },
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);
	});

	it("renders preset name in input", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		const input = screen.getByRole("textbox");
		expect(input).toHaveValue("Preset 1");
	});

	it("calls updatePresetName on blur with new name", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "New Name" } });
		fireEvent.blur(input);

		expect(mockUpdatePresetName).toHaveBeenCalledWith(0, "New Name");
	});

	it("skips update if name is unchanged on blur", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		const input = screen.getByRole("textbox");
		fireEvent.blur(input);

		expect(mockUpdatePresetName).not.toHaveBeenCalled();
	});

	it("handles Enter key in input", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "Enter Name" } });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(mockUpdatePresetName).toHaveBeenCalledWith(0, "Enter Name");
	});

	it("saves default value to store if name is empty on blur", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [100, 200],
		});

		render(<PresetSelector />);

		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "  " } });
		fireEvent.blur(input);

		expect(mockUpdatePresetName).toHaveBeenCalledWith(0, "100");
		expect(input).toHaveValue("100");
	});

	it("renders nothing if presetOption is missing", () => {
		vi.mocked(useOptionData).mockReturnValue(null as never);
		const { container } = render(<PresetSelector />);
		expect(container.firstChild).toBeNull();
	});

	it("handles preset selection and confirm dialog", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [10, 20],
		});

		render(<PresetSelector />);

		// Trigger selection via mock Select (which is a button)
		const mockSelect = screen.getByTestId("mock-select");
		fireEvent.click(mockSelect);

		expect(mockOpenBlockDialog).toHaveBeenCalled();
		const dialogConfig = mockOpenBlockDialog.mock.calls[0][0];
		expect(dialogConfig.type).toBe("confirm");

		// Test onConfirm
		await dialogConfig.onConfirm();
		expect(updateExrOption).toHaveBeenCalledWith(0, 0, 0, 1);
	});

	it("covers default name branch in handlePresetSelect", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [10, 20],
		});
		// No custom names in store
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: {},
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);

		const mockSelect = screen.getByTestId("mock-select");
		fireEvent.click(mockSelect);

		expect(mockOpenBlockDialog).toHaveBeenCalled();
		const dialogConfig = mockOpenBlockDialog.mock.calls[0][0];
		// Message should contain default names "10" and "20"
		expect(dialogConfig.message).toContain("10");
		expect(dialogConfig.message).toContain("20");
	});

	it("renders additional info in dropdown items when name is custom", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [123, 456],
		});
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: { 0: "Custom 1", 1: "Custom 2" },
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);
		// Current input value
		expect(screen.getByRole("textbox")).toHaveValue("Custom 1");
		// Check dropdown items (rendered by mock)
		expect(screen.getByText("(123)")).toBeInTheDocument();
		expect(screen.getByText("(456)")).toBeInTheDocument();
	});

	it("does not render parentheses when name matches value", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [123],
		});
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: { 0: "123" },
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);
		expect(screen.queryByText("(123)")).not.toBeInTheDocument();
	});
});
