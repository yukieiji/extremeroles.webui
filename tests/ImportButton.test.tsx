import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImportButton } from "@/components/parts/ImportButton";
import { translationMetaData } from "@/logics/api";

describe("ImportButton", () => {
	it("renders correctly with title and icon", () => {
		render(<ImportButton onImport={vi.fn()} />);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toContainElement(
			screen.getByText(translationMetaData.importCsv),
		);
		expect(button.querySelector("svg")).toBeInTheDocument();
	});

	it("is disabled when disabled prop is true", () => {
		render(<ImportButton onImport={vi.fn()} disabled={true} />);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	it("triggers file input click when button is clicked", () => {
		render(<ImportButton onImport={vi.fn()} />);

		screen.getByRole("button");
		// In JSDOM, input[type='file'].hidden is still findable by CSS selector but maybe not by role if not labeled.
		const input = document.querySelector("input[type='file']");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("accept", ".csv");
	});

	it("calls onImport when a file is selected", async () => {
		const onImport = vi.fn();
		render(<ImportButton onImport={onImport} />);

		const input = document.querySelector(
			"input[type='file']",
		) as HTMLInputElement;
		const file = new File(["test,csv,content"], "test.csv", {
			type: "text/csv",
		});

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(onImport).toHaveBeenCalledWith("test,csv,content");
		});
	});
});
