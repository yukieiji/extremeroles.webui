import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuOptionControl } from "@/feature/amongus/AuOptionControl";
import { translationMetaData } from "@/logics/api";
import type { AuOptionMeta } from "@/type";

describe("AuOptionControl", () => {
	const onSelectionChangeMock = vi.fn();
	let originalBooleanTransData: string[];

	beforeAll(() => {
		originalBooleanTransData = translationMetaData.booleanTransData;
	});

	beforeEach(() => {
		vi.clearAllMocks();
		// Initialize translationMetaData for Boolean toggle
		translationMetaData.booleanTransData = ["Off", "On"];
	});

	afterAll(() => {
		translationMetaData.booleanTransData = originalBooleanTransData;
	});

	it("renders OptionToggleControl when range is boolean", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Toggle",
			format: "",
			range: [false, true],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={0}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		const toggle = screen.getByRole("switch");
		expect(toggle).toBeInTheDocument();
		expect(screen.getByText("Off")).toBeInTheDocument();

		await act(async () => {
			fireEvent.click(toggle);
		});
		expect(onSelectionChangeMock).toHaveBeenCalledWith(1);
	});

	it("renders OptionSliderControl when range is number", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Slider",
			format: "{0}s",
			range: [0, 1, 2, 3, 4, 5],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={2}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("aria-valuenow", "2");
		expect(screen.getByText("s")).toBeInTheDocument();

		await act(async () => {
			fireEvent.change(slider, { target: { value: "4" } });
		});
		expect(onSelectionChangeMock).toHaveBeenCalledWith(4);

		// Test handleInputChange (text input)
		const input = screen.getByRole("textbox");
		await act(async () => {
			fireEvent.change(input, { target: { value: "3" } });
		});
		expect(onSelectionChangeMock).toHaveBeenCalledWith(3);

		// Test handleInputChange with NaN
		await act(async () => {
			fireEvent.change(input, { target: { value: "abc" } });
		});
		expect(onSelectionChangeMock).toHaveBeenCalledTimes(2); // Should not call onChange
	});

	it("renders OptionSliderControl even if range length is 2 (not boolean)", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Slider 2",
			format: "",
			range: [10, 20],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={0}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		const slider = screen.getByRole("slider", { hidden: true });
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute("aria-valuenow", "0");
	});

	it("renders OptionDropdownControl when range is string", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Dropdown",
			format: "",
			range: ["Option 1", "Option 2", "Option 3"],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={1}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		const dropdown = screen.getByRole("combobox");
		expect(dropdown).toBeInTheDocument();
		expect(dropdown).toHaveValue("1");
		expect(screen.getByText("Option 2")).toBeInTheDocument();

		await act(async () => {
			fireEvent.change(dropdown, { target: { value: "2" } });
		});
		expect(onSelectionChangeMock).toHaveBeenCalledWith(2);
	});

	it("renders OptionDropdownControl even if range length is 2 (not boolean/number)", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Dropdown 2",
			format: "",
			range: ["A", "B"],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={0}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("renders OptionDropdownControl for unexpected types or empty range", async () => {
		const optionMeta: AuOptionMeta = {
			title: "Test Empty",
			format: "",
			range: [],
		};

		await act(async () => {
			render(
				<AuOptionControl
					optionMeta={optionMeta}
					selection={0}
					onSelectionChange={onSelectionChangeMock}
				/>,
			);
		});

		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});
});
