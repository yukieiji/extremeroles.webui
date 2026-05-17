import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BorderLine } from "@/components/parts/BorderLine";
import { RightPanelBorderLine } from "@/components/parts/RightPanelBorderLine";

describe("BorderLine Components", () => {
	it("BorderLine renders correctly with different props", () => {
		const { container, rerender } = render(<BorderLine />);
		expect(container.querySelector("hr")).toBeInTheDocument();
		expect(container.firstChild).not.toHaveStyle("padding-left: 1rem");

		rerender(<BorderLine depth={1} indentMultiplier={1} />);
		expect(container.firstChild).toHaveStyle("padding-left: 1rem");

		rerender(<BorderLine className="test-class" />);
		expect(container.firstChild).toHaveClass("test-class");
	});

	it("RightPanelBorderLine renders correctly with different props", () => {
		const { container, rerender } = render(<RightPanelBorderLine />);
		expect(container.querySelector("hr")).toBeInTheDocument();

		rerender(<RightPanelBorderLine depth={2} indentMultiplier={0.5} />);
		expect(container.firstChild).toHaveStyle("padding-left: 1rem");

		rerender(<RightPanelBorderLine className="test-class" />);
		expect(container.firstChild).toHaveClass("test-class");
	});
});
