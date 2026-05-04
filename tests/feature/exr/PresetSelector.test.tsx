import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PresetSelector } from "../../../src/feature/exr/PresetSelector";
import { useOptionData } from "../../../src/hooks/useExROptionData";
import { useStore } from "../../../src/useStore";

vi.mock("../../../src/hooks/useExROptionData");
vi.mock("../../../src/useStore");
vi.mock("../../../src/hooks/useBackend", () => ({
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

		const button = screen.getByRole("button", { name: /プリセットを選択/i });
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
});
