import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuTab0OptionValue } from "@/feature/rightsidepanel/AuTab0OptionValue";
import { translationMetaData } from "@/logics/api";

describe("AuTab0OptionValue", () => {
	it("renders boolean values correctly with translation", () => {
		translationMetaData.booleanTransData = ["OFF", "ON"];
		const { rerender } = render(<AuTab0OptionValue value={true} format="" />);
		expect(screen.getByText("ON")).toBeInTheDocument();

		rerender(<AuTab0OptionValue value={false} format="" />);
		expect(screen.getByText("OFF")).toBeInTheDocument();
	});

	it("renders numeric values with format", () => {
		render(<AuTab0OptionValue value={1.5} format="{0}x" />);
		expect(screen.getByText("1.5")).toBeInTheDocument();
		expect(screen.getByText("x")).toBeInTheDocument();
	});

	it("renders string values", () => {
		render(<AuTab0OptionValue value="The Skeld" format="" />);
		expect(screen.getByText("The Skeld")).toBeInTheDocument();
	});
});
