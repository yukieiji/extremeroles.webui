import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColoredText } from "../src/components/parts/ColoredText";

describe("ColoredText", () => {
	it("renders plain text correctly", () => {
		const { container } = render(<ColoredText text="Hello World" />);
		expect(container.textContent).toBe("Hello World");
	});

	it("renders color tags correctly", () => {
		const { container } = render(
			<ColoredText text="<color=#FF0000>Red Text</color>" />,
		);
		const span = container.querySelector("span");
		expect(span).toBeInTheDocument();
		expect(span).toHaveStyle({ color: "rgb(255, 0, 0)" }); // JSDOM converts to rgb
		expect(span?.textContent).toBe("Red Text");
	});

	it("renders nested color tags correctly", () => {
		const { container } = render(
			<ColoredText text="Outer <color=#FF0000>Red <color=#00FF00>Green</color> Red</color> Outer" />,
		);
		expect(container.textContent).toBe("Outer Red Green Red Outer");

		const spans = container.querySelectorAll("span");
		expect(spans.length).toBe(2);

		const outerSpan = Array.from(spans).find(
			(s) => s.textContent === "Red Green Red",
		);
		expect(outerSpan).toHaveStyle({ color: "rgb(255, 0, 0)" });

		const innerSpan = outerSpan?.querySelector("span");
		expect(innerSpan).toHaveStyle({ color: "rgb(0, 255, 0)" });
		expect(innerSpan?.textContent).toBe("Green");
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
		const span = container.querySelector("span");
		expect(span).toHaveStyle({ color: "rgb(0, 0, 255)" });
		expect(span?.querySelectorAll("br").length).toBe(1);
		expect(container.querySelectorAll("br").length).toBe(3);
	});

	it("handles unclosed tags gracefully", () => {
		const { container } = render(
			<ColoredText text="<color=#FF0000>Unclosed" />,
		);
		// expect it to render as colored text
		const span = container.querySelector("span");
		expect(span).toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(span?.textContent).toBe("Unclosed");
	});

	it("handles extra closing tags gracefully", () => {
		const { container } = render(<ColoredText text="Extra</color>Closing" />);
		expect(container.textContent).toBe("Extra</color>Closing");
	});

	it("is case-insensitive for tags", () => {
		const { container } = render(
			<ColoredText text="<COLOR=#FF0000>Upper</COLOR>" />,
		);
		const span = container.querySelector("span");
		expect(span).toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(span?.textContent).toBe("Upper");
	});
});
