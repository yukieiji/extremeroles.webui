import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OptionSearchBar } from "@/feature/OptionSearchBar";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";

describe("OptionSearchBar", () => {
	it("renders correctly with search icon and placeholder", () => {
		render(<OptionSearchBar />);

		const input = screen.getByPlaceholderText(OPTION_SEARCH_PLACEHOLDER);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("type", "search");

		const icon = document.querySelector("svg");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("lucide-search");
	});
});
