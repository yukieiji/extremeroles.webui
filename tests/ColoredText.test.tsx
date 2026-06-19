import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColoredText } from "@/components/parts/ColoredText";

describe("ColoredText", () => {
	it("renders plain text correctly", () => {
		const { container } = render(<ColoredText text="Hello World" />);
		expect(container.textContent).toBe("Hello World");
	});

	it("renders color tags without hex styles", () => {
		const { container } = render(
			<ColoredText text="<color=#FF0000>Red Text</color>" />,
		);
		const outerSpan = container.firstElementChild;
		expect(outerSpan).toHaveClass("text-text-primary");

		const innerSpan = container.querySelector("span span");
		expect(innerSpan).toBeInTheDocument();
		expect(innerSpan).not.toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(innerSpan?.textContent).toBe("Red Text");
	});

	it("renders nested color tags without hex styles", () => {
		const { container } = render(
			<ColoredText text="Outer <color=#FF0000>Red <color=#00FF00>Green</color> Red</color> Outer" />,
		);
		expect(container.textContent).toBe("Outer Red Green Red Outer");

		const outerSpan = container.firstElementChild;
		expect(outerSpan).toHaveClass("text-text-primary");

		const spans = container.querySelectorAll("span");
		// 1 (root) + 1 (red) + 1 (green) = 3
		expect(spans.length).toBe(3);

		for (const span of Array.from(spans)) {
			expect(span).not.toHaveStyle({ color: "rgb(255, 0, 0)" });
			expect(span).not.toHaveStyle({ color: "rgb(0, 255, 0)" });
		}
	});

	it("renders newlines as <br />", () => {
		const { container } = render(<ColoredText text={"Line 1\nLine 2"} />);
		expect(container.querySelector("br")).toBeInTheDocument();
		expect(container.textContent).toBe("Line 1Line 2"); // br doesn't add text content
	});

	it("handles mixed content correctly", () => {
		const { container } = render(
			<ColoredText text={"Start\n<color=#0000FF>Blue\nText</color>\nEnd"} />,
		);
		expect(container.textContent).toBe("StartBlueTextEnd");
		const rootSpan = container.firstElementChild;
		expect(rootSpan).toHaveClass("text-text-primary");

		const innerSpan = container.querySelector("span span");
		expect(innerSpan).not.toHaveStyle({ color: "rgb(0, 0, 255)" });
		expect(innerSpan?.querySelectorAll("br").length).toBe(1);
		expect(container.querySelectorAll("br").length).toBe(3);
	});

	it("handles unclosed tags gracefully", () => {
		const { container } = render(
			<ColoredText text="<color=#FF0000>Unclosed" />,
		);
		const innerSpan = container.querySelector("span span");
		expect(innerSpan).not.toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(innerSpan?.textContent).toBe("Unclosed");
	});

	it("handles extra closing tags gracefully", () => {
		const { container } = render(<ColoredText text="Extra</color>Closing" />);
		expect(container.textContent).toBe("Extra</color>Closing");
	});

	it("is case-insensitive for tags", () => {
		const { container } = render(
			<ColoredText text="<COLOR=#FF0000>Upper</COLOR>" />,
		);
		const innerSpan = container.querySelector("span span");
		expect(innerSpan).not.toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(innerSpan?.textContent).toBe("Upper");
	});

	it("applies variant classes correctly", () => {
		const { container: primary } = render(
			<ColoredText text="Text" variant="primary" />,
		);
		expect(primary.firstElementChild).toHaveClass("text-text-primary");

		const { container: secondary } = render(
			<ColoredText text="Text" variant="secondary" />,
		);
		expect(secondary.firstElementChild).toHaveClass("text-text-secondary");

		const { container: tertiary } = render(
			<ColoredText text="Text" variant="tertiary" />,
		);
		expect(tertiary.firstElementChild).toHaveClass("text-text-tertiary");
	});
});
