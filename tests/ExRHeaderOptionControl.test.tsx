import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRHeaderOptionControl } from "../src/feature/ExRHeaderOptionControl";
import type { ExROptionDto } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRHeaderOptionControl", () => {
	const mockOption: ExROptionDto = {
		Id: 50,
		IsActive: true,
		TranslatedName: "レート",
		Selection: 0,
		Format: "{0}%",
		RangeMeta: { Type: "Int32", Values: [0, 50, 100] },
		Childs: [],
	};

	beforeEach(() => {
		useStore.getState().resetViewer();
	});

	it("renders correctly with given label and value", () => {
		render(
			<ExRHeaderOptionControl
				categoryId={1}
				option={mockOption}
				label="Rate"
			/>,
		);

		expect(screen.getByText("Rate")).toBeInTheDocument();
		expect(screen.getByRole("slider")).toHaveValue("0");

		const inputs = screen.getAllByDisplayValue("0");
		const textInput = inputs.find(
			(i) => (i as HTMLInputElement).type === "text",
		);
		expect(textInput).toBeInTheDocument();
	});

	it("prevents click propagation to parent", () => {
		const parentClick = vi.fn();
		render(
			<button
				type="button"
				onClick={parentClick}
				onKeyDown={parentClick}
				aria-label="parent"
			>
				<ExRHeaderOptionControl
					categoryId={1}
					option={mockOption}
					label="Rate"
				/>
			</button>,
		);

		const label = screen.getByText("Rate");
		fireEventClick(label);

		expect(parentClick).not.toHaveBeenCalled();
	});

	function fireEventClick(element: HTMLElement) {
		const event = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
		});
		element.dispatchEvent(event);
	}
});
