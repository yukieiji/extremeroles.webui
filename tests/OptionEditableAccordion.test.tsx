import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OptionEditableAccordion } from "../src/components/blocks/OptionEditableAccordion";

describe("OptionEditableAccordion", () => {
	it("renders optionItem and handles toggle", () => {
		const onToggle = vi.fn();
		render(
			<OptionEditableAccordion
				optionItem={<span>Parent Option</span>}
				isOpen={false}
				onToggle={onToggle}
				depth={0}
			>
				<div>Child Content</div>
			</OptionEditableAccordion>,
		);

		expect(screen.getByText("Parent Option")).toBeInTheDocument();

		const toggleButton = screen.getByLabelText("開く");
		fireEvent.click(toggleButton);
		expect(onToggle).toHaveBeenCalled();
	});

	it("shows/hides children based on isOpen", () => {
		const { rerender } = render(
			<OptionEditableAccordion
				optionItem={<span>Parent</span>}
				isOpen={false}
				onToggle={() => {}}
				depth={0}
			>
				<div>Child Content</div>
			</OptionEditableAccordion>,
		);

		expect(screen.queryByText("Child Content")).not.toBeInTheDocument();

		rerender(
			<OptionEditableAccordion
				optionItem={<span>Parent</span>}
				isOpen={true}
				onToggle={() => {}}
				depth={0}
			>
				<div>Child Content</div>
			</OptionEditableAccordion>,
		);

		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});
});
