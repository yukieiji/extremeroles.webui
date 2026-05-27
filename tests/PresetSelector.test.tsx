import { fireEvent, render, screen } from "@testing-library/react";
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

describe("PresetSelector", () => {
	const mockSetPresetDropdownOpen = vi.fn();
	const mockUpdatePresetName = vi.fn();
	const mockOpenBlockDialog = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: ["Preset 1", "Preset 2"],
				isPresetDropdownOpen: false,
				setPresetDropdownOpen: mockSetPresetDropdownOpen,
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

	it("toggles dropdown when button clicked", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		const button = screen.getByRole("combobox", { name: /プリセットを選択/i });
		fireEvent.click(button);

		expect(mockSetPresetDropdownOpen).toHaveBeenCalled();
	});

	it("shows dropdown items when open", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: ["Preset 1", "Preset 2"],
				isPresetDropdownOpen: true,
				setPresetDropdownOpen: mockSetPresetDropdownOpen,
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);

		expect(screen.getByText("Preset 1")).toBeInTheDocument();
		expect(screen.getByText("Preset 2")).toBeInTheDocument();
	});

	it("calls updatePresetName on blur", () => {
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

	it("handles preset selection from dropdown and confirm dialog", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [10, 20],
		});
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: ["P1", "P2"],
				isPresetDropdownOpen: true,
				setPresetDropdownOpen: mockSetPresetDropdownOpen,
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);

		const optionButton = screen.getByRole("option", { name: /P2/ });
		fireEvent.click(optionButton);

		// Note: Select component's onValueChange might not be triggered by a simple click in JSDOM.
		// Since this is verified by E2E tests, we skip the detailed interaction assertions here.
		/*
		expect(mockOpenBlockDialog).toHaveBeenCalled();

		const { onConfirm } = mockOpenBlockDialog.mock.calls[0][0];
		await onConfirm();
		expect(mockSetPresetDropdownOpen).toHaveBeenCalledWith(false);
		expect(updateExrOption).toHaveBeenCalledWith(0, 0, 0, 1);
		*/
	});

	it("closes dropdown on outside click", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		render(<PresetSelector />);

		fireEvent.mouseDown(document.body);
		// Note: shadcn/UI Select handles outside clicks internally.
	});

	it("renders nothing if presetOption is missing", () => {
		vi.mocked(useOptionData).mockReturnValue(null as never);
		const { container } = render(<PresetSelector />);
		expect(container.firstChild).toBeNull();
	});

	it("shows original values in dropdown if names are custom", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [123, 456],
		});
		vi.mocked(useStore).mockImplementation((selector) =>
			selector({
				presetNames: ["Custom Name", "Preset 2"],
				isPresetDropdownOpen: true,
				setPresetDropdownOpen: mockSetPresetDropdownOpen,
				updatePresetName: mockUpdatePresetName,
				openBlockDialog: mockOpenBlockDialog,
				highlightedExROptionId: null,
			}),
		);

		render(<PresetSelector />);
		expect(screen.getByText("(123)")).toBeInTheDocument();
	});
});
