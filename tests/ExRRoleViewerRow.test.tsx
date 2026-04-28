import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExRRoleViewerRow } from "../src/feature/rightsidepanel/ExRRoleViewerRow";
import { exrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

vi.mock("../src/hooks/useExRNavigation", () => ({
	useExRNavigation: () => ({
		navigateToExROption: vi.fn(),
	}),
}));

describe("ExRRoleViewerRow", () => {
	it("renders role info correctly", () => {
		const tabId = 1;
		const categoryId = 300;
		const uniqueRateId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_RATE_OPTION_ID,
		);
		const uniqueCountId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_COUNT_OPTION_ID,
		);

		exrOptionMetaData.categories[categoryId] = {
			name: "Test Role",
			tabId: tabId,
		};

		useStore.getState().setExROptions(
			{
				[uniqueRateId]: { selection: 5, values: [0, 10, 20, 30, 40, 50] },
				[uniqueCountId]: { selection: 2, values: [1, 2, 3] },
			},
			{ [uniqueRateId]: true, [uniqueCountId]: true },
		);

		render(<ExRRoleViewerRow tabId={tabId} categoryId={categoryId} />);

		expect(screen.getByText("Test Role")).toBeInTheDocument();
		expect(screen.getByText("50%")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});
});
