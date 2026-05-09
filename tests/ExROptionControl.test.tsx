import { act, fireEvent, render, screen } from "@testing-library/react";
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

	it("renders OptionSliderControl when type is Int32", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 1,
			values: [0, 10, 20],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format="{0}%"
					type="Int32"
				/>,
			);
		});

		const slider = screen
			.getAllByDisplayValue("1")
			.find((e) => (e as HTMLInputElement).type === "range");
		expect(slider).toBeInTheDocument();
	});

	it("renders OptionSliderControl when type is Single", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0.5, 1.0, 1.5],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format="{0}x"
					type="Single"
				/>,
			);
		});

		const slider = screen
			.getAllByDisplayValue("0")
			.find((e) => (e as HTMLInputElement).type === "range");
		expect(slider).toBeInTheDocument();
	});

	it("renders OptionToggleControl when type is String and values have color tags", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: ["<color=#FF0000>OFF</color>", "<color=#00FF00>ON</color>"],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="String"
				/>,
			);
		});

		const toggle = screen.getByRole("switch");
		expect(toggle).toBeInTheDocument();
		expect(screen.getByText("OFF")).toBeInTheDocument();
	});

	it("renders OptionDropdownControl when type is String and values do not have color tags", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 1,
			values: ["Option A", "Option B", "Option C"],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="String"
				/>,
			);
		});

		const dropdown = screen.getByRole("combobox");
		expect(dropdown).toBeInTheDocument();
		expect(dropdown).toHaveValue("1");
		expect(screen.getByText("Option B")).toBeInTheDocument();
	});

	it("renders OptionDropdownControl when type is String and has more than 2 values even with color tags", async () => {
		// Currently the logic is stringValues.length === 2 && every has color tags
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [
				"<color=#1>A</color>",
				"<color=#2>B</color>",
				"<color=#3>C</color>",
			],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="String"
				/>,
			);
		});

		const dropdown = screen.getByRole("combobox");
		expect(dropdown).toBeInTheDocument();
	});

	it("uses default selection 0 if optionValue.selection is missing", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: undefined as unknown as number,
			values: [0, 10, 20],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format="{0}"
					type="Int32"
				/>,
			);
		});

		const slider = screen
			.getAllByDisplayValue("0")
			.find((e) => (e as HTMLInputElement).type === "range");
		expect(slider).toBeInTheDocument();
	});

	it("calls updateExRSelection when value changes (Slider)", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 10, 20],
		});

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format="{0}"
					type="Int32"
				/>,
			);
		});

		const slider = screen
			.getAllByDisplayValue("0")
			.find((e) => (e as HTMLInputElement).type === "range");
		await act(async () => {
			// biome-ignore lint/style/noNonNullAssertion: test
			fireEvent.change(slider!, { target: { value: "2" } });
		});

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

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="String"
				/>,
			);
		});

		const dropdown = screen.getByRole("combobox");
		await act(async () => {
			fireEvent.change(dropdown, { target: { value: "1" } });
		});

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

		await act(async () => {
			render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="String"
				/>,
			);
		});

		const toggle = screen.getByRole("switch");
		await act(async () => {
			fireEvent.click(toggle);
		});

		expect(mockUpdateExRSelection).toHaveBeenCalledWith({
			uniqueOptionId: mockUniqueId,
			selection: 1,
		});
	});

	it("returns null for unknown type", async () => {
		vi.mocked(useOptionData).mockReturnValue({
			selection: 0,
			values: [0, 1],
		});

		let renderResult: any;
		await act(async () => {
			renderResult = render(
				<ExROptionControl
					uniqueOptionId={mockUniqueId}
					format=""
					type="UnknownType"
				/>,
			);
		});

		expect(renderResult.container.firstChild).toBeNull();
	});
});
