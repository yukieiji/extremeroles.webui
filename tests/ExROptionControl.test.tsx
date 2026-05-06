import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExROptionControl } from "@/feature/exr/ExROptionControl";
import { useOptionData } from "@/hooks/useExROptionData";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import type { UniqueOptionId } from "@/type";

vi.mock("@/hooks/useExROptionData");
vi.mock("@/logics/api.store");

describe("ExROptionControl", () => {
	const mockUniqueId = 123 as UniqueOptionId;
	const mockUpdateExRSelection = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useUpdateExROptionSelection).mockReturnValue(
			mockUpdateExRSelection,
		);
	});

	it("renders OptionSliderControl when type is Int32", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 1,
			values: [0, 10, 20],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format="{0}%"
				type="Int32"
			/>,
		);

		const slider = screen.getByRole("slider");
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveValue("1");
	});

	it("renders OptionSliderControl when type is Single", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0.5, 1.0, 1.5],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format="{0}x"
				type="Single"
			/>,
		);

		const slider = screen.getByRole("slider");
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveValue("0");
	});

	it("renders OptionToggleControl when type is String and values have color tags", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: ["<color=#FF0000>OFF</color>", "<color=#00FF00>ON</color>"],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="String"
			/>,
		);

		const toggle = screen.getByRole("switch");
		expect(toggle).toBeInTheDocument();
		expect(screen.getByText("OFF")).toBeInTheDocument();
	});

	it("renders OptionDropdownControl when type is String and values do not have color tags", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 1,
			values: ["Option A", "Option B", "Option C"],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="String"
			/>,
		);

		const dropdown = screen.getByRole("combobox");
		expect(dropdown).toBeInTheDocument();
		expect(dropdown).toHaveValue("1");
		expect(screen.getByText("Option B")).toBeInTheDocument();
	});

	it("renders OptionDropdownControl when type is String and has more than 2 values even with color tags", () => {
		// Currently the logic is stringValues.length === 2 && every has color tags
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [
				"<color=#1>A</color>",
				"<color=#2>B</color>",
				"<color=#3>C</color>",
			],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="String"
			/>,
		);

		const dropdown = screen.getByRole("combobox");
		expect(dropdown).toBeInTheDocument();
	});

	it("uses default selection 0 if optionValue.selection is missing", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: undefined as unknown as number,
			values: [0, 10, 20],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format="{0}"
				type="Int32"
			/>,
		);

		const slider = screen.getByRole("slider");
		expect(slider).toHaveValue("0");
	});

	it("calls updateExRSelection when value changes (Slider)", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 10, 20],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format="{0}"
				type="Int32"
			/>,
		);

		const slider = screen.getByRole("slider");
		fireEvent.change(slider, { target: { value: "2" } });

		expect(mockUpdateExRSelection).toHaveBeenCalledWith({
			uniqueOptionId: mockUniqueId,
			selection: 2,
		});
	});

	it("calls updateExRSelection when value changes (Dropdown)", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: ["A", "B"],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="String"
			/>,
		);

		const dropdown = screen.getByRole("combobox");
		fireEvent.change(dropdown, { target: { value: "1" } });

		expect(mockUpdateExRSelection).toHaveBeenCalledWith({
			uniqueOptionId: mockUniqueId,
			selection: 1,
		});
	});

	it("calls updateExRSelection when value changes (Toggle)", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: ["<color=#FF0000>OFF</color>", "<color=#00FF00>ON</color>"],
		});

		render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="String"
			/>,
		);

		const toggle = screen.getByRole("switch");
		fireEvent.click(toggle);

		expect(mockUpdateExRSelection).toHaveBeenCalledWith({
			uniqueOptionId: mockUniqueId,
			selection: 1,
		});
	});

	it("returns null for unknown type", () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		const { container } = render(
			<ExROptionControl
				uniqueOptionId={mockUniqueId}
				format=""
				type="UnknownType"
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});
