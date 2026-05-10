import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { AccordionBody } from "@/components/blocks/AccordionBody";

describe("AccordionBody", () => {
	it("should display title and content when open", async () => {
		const onToggle = vi.fn();
		await act(async () => {
			render(
				<AccordionBody title="Test Title" isOpen={true} onToggle={onToggle}>
					<div>Test Content</div>
				</AccordionBody>,
			);
		});

		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Test Content")).toBeInTheDocument();

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("should handle toggle lifecycle (initial closed, open, close)", async () => {
		const TestWrapper = () => {
			const [isOpen, setIsOpen] = React.useState(false);
			return (
				<AccordionBody
					title="Test Title"
					isOpen={isOpen}
					onToggle={() => setIsOpen(!isOpen)}
				>
					<div>Test Content</div>
				</AccordionBody>
			);
		};

		await act(async () => {
			render(<TestWrapper />);
		});
		const button = screen.getByRole("button");

		// 1. 初期状態: 閉じている
		expect(button).toHaveAttribute("aria-expanded", "false");
		// 閉じているときはコンテンツがレンダリングされないことを確認
		expect(screen.queryByText("Test Content")).not.toBeInTheDocument();

		// 2. 開く動作
		await act(async () => {
			fireEvent.click(button);
		});
		expect(button).toHaveAttribute("aria-expanded", "true");
		const content = screen.getByText("Test Content");
		const contentContainer = screen.getByTestId("accordion-content");
		expect(contentContainer).toHaveAttribute("data-open", "");

		// 3. 閉じる動作
		await act(async () => {
			fireEvent.click(button);
		});
		expect(button).toHaveAttribute("aria-expanded", "false");
		expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
	});
});
