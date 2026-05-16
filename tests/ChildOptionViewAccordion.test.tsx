import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChildOptionViewAccordion } from "@/components/blocks/ChildOptionViewAccordion";
import { CLOSE, OPEN } from "@/noTrans";

describe("ChildOptionViewAccordion", () => {
	const defaultProps = {
		optionItem: <div>Option Item</div>,
		isOpen: false,
		onToggle: vi.fn(),
		depth: 0,
		children: <div>Child Content</div>,
	};

	it("should render optionItem", () => {
		render(<ChildOptionViewAccordion {...defaultProps} />);
		expect(screen.getByText("Option Item")).toBeInTheDocument();
	});

	it("should not render children when isOpen is false", () => {
		render(<ChildOptionViewAccordion {...defaultProps} isOpen={false} />);
		expect(screen.queryByText("Child Content")).not.toBeInTheDocument();

		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveClass("grid-rows-[0fr]");
	});

	it("should render children when isOpen is true", () => {
		render(<ChildOptionViewAccordion {...defaultProps} isOpen={true} />);
		expect(screen.getByText("Child Content")).toBeInTheDocument();

		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveClass("grid-rows-[1fr]");
	});

	it("should call onToggle when the button is clicked", () => {
		const onToggle = vi.fn();
		render(<ChildOptionViewAccordion {...defaultProps} onToggle={onToggle} />);

		const button = screen.getByRole("button", { name: OPEN });
		fireEvent.click(button);

		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it("should have correct accessibility attributes when closed", () => {
		render(<ChildOptionViewAccordion {...defaultProps} isOpen={false} />);

		const button = screen.getByRole("button", { name: OPEN });
		expect(button).toHaveAttribute("aria-expanded", "false");
		expect(button).toHaveAttribute("aria-label", OPEN);
	});

	it("should have correct accessibility attributes when open", () => {
		render(<ChildOptionViewAccordion {...defaultProps} isOpen={true} />);

		const button = screen.getByRole("button", { name: CLOSE });
		expect(button).toHaveAttribute("aria-expanded", "true");
		expect(button).toHaveAttribute("aria-label", CLOSE);
	});

	it("should apply indentation to the header when depth > 0", () => {
		render(<ChildOptionViewAccordion {...defaultProps} depth={1} />);

		// OptionRowContainer now receives the padding through its inner flex div
		const header = screen.getByText("Option Item");
		// The parent of Option Item (content area) should have its grandparent as the flex container with style
		const flexContainer = header.parentElement?.parentElement;
		expect(flexContainer).toHaveStyle({
			paddingLeft: "calc(0.875rem)",
		});
	});

	it("should apply correct indentation for large depth", () => {
		render(<ChildOptionViewAccordion {...defaultProps} depth={5} />);

		const header = screen.getByText("Option Item");
		const flexContainer = header.parentElement?.parentElement;
		expect(flexContainer).toHaveStyle({
			paddingLeft: "calc(2.875rem)",
		});
	});
});
