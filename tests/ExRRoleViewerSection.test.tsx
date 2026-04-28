import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExRRoleViewerSection } from "../src/feature/rightsidepanel/ExRRoleViewerSection";
import { exrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../src/type";
import { useStore } from "../src/useStore";

vi.mock("../src/hooks/useExRNavigation", () => ({
	useExRNavigation: () => ({
		navigateToExROption: vi.fn(),
	}),
}));

describe("ExRRoleViewerSection", () => {
	it("renders only active roles", () => {
		const tabId = 1;
		const categoryId1 = 400; // Active
		const categoryId2 = 401; // Inactive (rate 0)

		exrOptionMetaData.tabs[tabId] = {
			name: "Crewmate Roles",
			categoryIds: [categoryId1, categoryId2],
		};
		exrOptionMetaData.categories[categoryId1] = { name: "Role 1", tabId };
		exrOptionMetaData.categories[categoryId2] = { name: "Role 2", tabId };

		const uniqueRateId1 = getUniqueOptionId(
			tabId,
			categoryId1,
			SPAWN_RATE_OPTION_ID,
		);
		const uniqueCountId1 = getUniqueOptionId(
			tabId,
			categoryId1,
			SPAWN_COUNT_OPTION_ID,
		);
		const uniqueRateId2 = getUniqueOptionId(
			tabId,
			categoryId2,
			SPAWN_RATE_OPTION_ID,
		);
		const uniqueCountId2 = getUniqueOptionId(
			tabId,
			categoryId2,
			SPAWN_COUNT_OPTION_ID,
		);

		useStore.getState().setExROptions(
			{
				[uniqueRateId1]: { selection: 1, values: [0, 10] },
				[uniqueCountId1]: { selection: 0, values: [1] },
				[uniqueRateId2]: { selection: 0, values: [0, 10] },
				[uniqueCountId2]: { selection: 0, values: [1] },
			},
			{
				[uniqueRateId1]: true,
				[uniqueCountId1]: true,
				[uniqueRateId2]: true,
				[uniqueCountId2]: true,
			},
		);

		render(
			<ExRRoleViewerSection
				tabId={tabId}
				title="Test Section"
				isOpen={true}
				onToggle={() => {}}
			/>,
		);

		expect(screen.getByText("Test Section")).toBeInTheDocument();
		expect(screen.getByText("Role 1")).toBeInTheDocument();
		expect(screen.queryByText("Role 2")).not.toBeInTheDocument();
	});

	it("returns null if no roles meet criteria", () => {
		const tabId = 2;
		exrOptionMetaData.tabs[tabId] = { name: "Impostor Roles", categoryIds: [] };

		const { container } = render(
			<ExRRoleViewerSection
				tabId={tabId}
				title="Empty Section"
				isOpen={true}
				onToggle={() => {}}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
