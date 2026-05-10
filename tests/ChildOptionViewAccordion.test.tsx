import { act, fireEvent, render, screen } from "@testing-library/react";
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

	it("should not render children when isOpen is false", async () => {
		await act(async () => {
			render(<ChildOptionViewAccordion {...defaultProps} isOpen={false} />);
		});
		expect(screen.queryByText("Child Content")).not.toBeInTheDocument();
	});

	it("should render children when isOpen is true", async () => {
		await act(async () => {
			render(<ChildOptionViewAccordion {...defaultProps} isOpen={true} />);
		});
		expect(screen.getByText("Child Content")).toBeInTheDocument();

		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveAttribute("data-open", "");
	});

	it("should call onToggle when the button is clicked", async () => {
		const onToggle = vi.fn();
		await act(async () => {
			render(
				<ChildOptionViewAccordion {...defaultProps} onToggle={onToggle} />,
			);
		});

		const button = screen.getByRole("button", { name: OPEN });
		await act(async () => {
			fireEvent.click(button);
		});

		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it("should have correct accessibility attributes when closed", () => {
		render(<ChildOptionViewAccordion {...defaultProps} isOpen={false} />);

		const button = screen.getByRole("button", { name: OPEN });
		expect(button).toHaveAttribute("aria-expanded", "false");
		expect(button).toHaveAttribute("aria-label", OPEN);
	});

	it("should have correct accessibility attributes when open", async () => {
		await act(async () => {
			render(<ChildOptionViewAccordion {...defaultProps} isOpen={true} />);
		});

		const button = screen.getByRole("button", { name: CLOSE });
		expect(button).toHaveAttribute("aria-expanded", "true");
		expect(button).toHaveAttribute("aria-label", CLOSE);
	});

	it("should apply padding class when depth > 0", () => {
		const { container: containerDepth0 } = render(
			<ChildOptionViewAccordion {...defaultProps} depth={0} />,
		);
		expect(containerDepth0.firstChild).not.toHaveClass("pl-2");

		const { container: containerDepth1 } = render(
			<ChildOptionViewAccordion {...defaultProps} depth={1} />,
		);
		expect(containerDepth1.firstChild).toHaveClass("pl-2");
	});

	it("should apply padding class when depth is large", () => {
		const { container } = render(
			<ChildOptionViewAccordion {...defaultProps} depth={5} />,
		);
		expect(container.firstChild).toHaveClass("pl-2");
	});
});
