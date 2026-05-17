import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RowCustomizeAccordion } from "@/components/blocks/OptionEditableAccordion";

describe("RowCustomizeAccordion", () => {
	const defaultProps = {
		row: <div>Header Row</div>,
		isOpen: false,
		children: <div>Child Content</div>,
	};

	it("should render row content", () => {
		render(<RowCustomizeAccordion {...defaultProps} />);
		expect(screen.getByText("Header Row")).toBeInTheDocument();
	});

	it("should not render children when isOpen is false", () => {
		render(<RowCustomizeAccordion {...defaultProps} isOpen={false} />);
		expect(screen.queryByText("Child Content")).not.toBeInTheDocument();

		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveClass("grid-rows-[0fr]");
	});

	it("should render children when isOpen is true", () => {
		render(<RowCustomizeAccordion {...defaultProps} isOpen={true} />);
		expect(screen.getByText("Child Content")).toBeInTheDocument();

		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveClass("grid-rows-[1fr]");
	});

	it("should NOT have padding class on container (to support full-width hover background)", () => {
		const { container } = render(<RowCustomizeAccordion {...defaultProps} />);
		// The outer div should just be "flex flex-col" without "pl-4"
		expect(container.firstChild).toHaveClass("flex flex-col");
		expect(container.firstChild).not.toHaveClass("pl-4");
	});
});
