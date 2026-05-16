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

	it("should apply padding class to the row container when depth > 0", () => {
		const { rerender } = render(
			<ChildOptionViewAccordion {...defaultProps} depth={0} />,
		);
		const button0 = screen.getByRole("button", { name: OPEN });
		const row0 = button0.closest("div[class*='hover:bg-']");
		expect(row0).not.toHaveClass("pl-2");

		rerender(<ChildOptionViewAccordion {...defaultProps} depth={1} />);
		const button1 = screen.getByRole("button", { name: OPEN });
		const row1 = button1.closest("div[class*='hover:bg-']");
		expect(row1).toHaveClass("pl-2");
	});

	it("should apply padding class to the row container when depth is large", () => {
		render(<ChildOptionViewAccordion {...defaultProps} depth={5} />);
		const button = screen.getByRole("button", { name: OPEN });
		const row = button.closest("div[class*='hover:bg-']");
		expect(row).toHaveClass("pl-10"); // getIndentClass(5, 2)
	});
});
