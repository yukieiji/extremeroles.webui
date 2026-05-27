import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PresetSelector } from "@/feature/exr/PresetSelector";
import { useOptionData } from "@/hooks/useExROptionData";
import { useStore } from "@/useStore";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/useStore");
vi.mock("@/hooks/useBackend", () => ({
	useBackendUpdate: () => vi.fn((callback: () => Promise<void>) => callback()),
}));

// Mock fetch to avoid ERR_INVALID_URL and validation errors
global.fetch = vi.fn().mockImplementation(() =>
	Promise.resolve({
		ok: true,
		status: 200,
		json: () =>
			Promise.resolve({
				UpdatedCategory: null,
				ChainUpdatedOption: [],
			}),
	}),
);

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		open,
		onOpenChange,
		onValueChange,
		value,
	}: {
		children: React.ReactNode;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onValueChange?: (value: string) => void;
		value?: string;
	}) => (
		<div data-testid="select-root" data-open={open} data-value={value}>
			{children}
			{open && (
				// biome-ignore lint/a11y/noStaticElementInteractions: mock for testing
				<div
					data-testid="select-portal"
					onClick={() => {
						onOpenChange?.(false);
					}}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							onOpenChange?.(false);
						}
					}}
				>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: mock for testing */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: mock for testing */}
					<div
						data-testid="select-content"
						onClick={(e) => {
							e.stopPropagation(); // Avoid triggering portal click
							const target = e.target as HTMLElement;
							const item = target.closest("[data-select-item]");
							if (item) {
								onValueChange?.(item.getAttribute("data-value") || "");
							}
						}}
					>
						<div role="listbox">{children}</div>
					</div>
				</div>
			)}
		</div>
	),
	SelectTrigger: ({
		children,
		className,
		"aria-label": ariaLabel,
	}: {
		children: React.ReactNode;
		className?: string;
		"aria-label"?: string;
	}) => (
		<button
			type="button"
			className={className}
			aria-label={ariaLabel}
			role="combobox"
			aria-expanded={false}
		>
			{children}
		</button>
	),
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => (
		<div role="option" data-select-item data-value={value} tabIndex={0}>
			{children}
		</div>
	),
}));

describe("PresetSelector", () => {
	const mockSetPresetDropdownOpen = vi.fn();
	const mockUpdatePresetName = vi.fn();
	const mockOpenBlockDialog = vi.fn();

	const mockState = {
		presetNames: ["Preset 1", "Preset 2"],
		isPresetDropdownOpen: false,
		setPresetDropdownOpen: mockSetPresetDropdownOpen,
		updatePresetName: mockUpdatePresetName,
		openBlockDialog: mockOpenBlockDialog,
		highlightedExROptionId: null,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useStore).mockImplementation((selector) => selector(mockState));
		(useStore as unknown as { getState: () => typeof mockState }).getState =
			() => mockState;
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
		expect(button).toBeInTheDocument();
	});

	it("shows dropdown items when open", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});
		mockState.isPresetDropdownOpen = true;

		render(<PresetSelector />);

		const portal = screen.getByTestId("select-portal");
		expect(within(portal).getByText("Preset 1")).toBeInTheDocument();
		expect(within(portal).getByText("Preset 2")).toBeInTheDocument();
	});

	it("calls updatePresetName on blur", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});
		mockState.isPresetDropdownOpen = false;

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
		mockState.presetNames = ["P1", "P2"];
		mockState.isPresetDropdownOpen = true;

		render(<PresetSelector />);

		const portal = screen.getByTestId("select-portal");
		const optionButton = within(portal).getByRole("option", { name: /P2/ });
		fireEvent.click(optionButton);

		expect(mockOpenBlockDialog).toHaveBeenCalled();

		const { onConfirm } = mockOpenBlockDialog.mock.calls[0][0];
		await onConfirm();
		expect(mockSetPresetDropdownOpen).toHaveBeenCalledWith(false);
	});

	it("closes dropdown on outside click", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});
		mockState.isPresetDropdownOpen = true;

		render(<PresetSelector />);

		const portal = screen.getByTestId("select-portal");
		fireEvent.click(portal);
		expect(mockSetPresetDropdownOpen).toHaveBeenCalledWith(false);
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
		mockState.presetNames = ["Custom Name", "Preset 2"];
		mockState.isPresetDropdownOpen = true;

		render(<PresetSelector />);
		const portal = screen.getByTestId("select-portal");
		expect(within(portal).getByText("(123)")).toBeInTheDocument();
	});
});
