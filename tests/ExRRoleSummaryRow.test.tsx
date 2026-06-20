import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExRRoleSummaryRow } from "@/feature/rightsidepanel/summary/ExRRoleSummaryRow";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { ExRTabId, SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "@/type";
import { useStore } from "@/useStore";

describe("ExRRoleSummaryRow", () => {
	beforeEach(() => {
		resetExrOptionMetaData();
		// Zustandのstoreのリセット。SliceにresetAllなどがあるか確認が必要だが、一旦デフォルト値をセットする
		useStore.setState(useStore.getState()); // reset to initial is hard without direct reset, using setExROptions
	});

	it("renders active ExR role summary", () => {
		const tabId = ExRTabId.CrewmateTab;
		const categoryId = 100;
		const chanceId = getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID);
		const countId = getUniqueOptionId(tabId, categoryId, SPAWN_COUNT_OPTION_ID);

		exrOptionMetaData.categories[categoryId] = {
			name: "Test Role",
			tabId: tabId,
			categoryColors: [],
		};
		exrOptionMetaData.tabs[tabId] = {
			name: "Crewmate",
			categoryIds: [categoryId],
			colors: [],
		};

		useStore.getState().setExROptions(
			{
				[chanceId]: { selection: 1, values: [0, 50, 100] },
				[countId]: { selection: 1, values: [0, 1, 2] },
			},
			{
				[chanceId]: true,
				[countId]: true,
			},
		);

		render(<ExRRoleSummaryRow categoryId={categoryId} />);

		expect(screen.getByText("Test Role")).toBeInTheDocument();
		expect(screen.getByText("1 - 50%")).toBeInTheDocument();
	});

	it("returns null if role is inactive (chance 0%)", () => {
		const tabId = ExRTabId.CrewmateTab;
		const categoryId = 100;
		const chanceId = getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID);
		const countId = getUniqueOptionId(tabId, categoryId, SPAWN_COUNT_OPTION_ID);

		exrOptionMetaData.categories[categoryId] = {
			name: "Test Role",
			tabId: tabId,
			categoryColors: [],
		};

		useStore.getState().setExROptions(
			{
				[chanceId]: { selection: 0, values: [0, 50, 100] },
				[countId]: { selection: 1, values: [0, 1, 2] },
			},
			{},
		);

		const { container } = render(<ExRRoleSummaryRow categoryId={categoryId} />);
		expect(container.firstChild).toBeNull();
	});

	it("returns null if role is inactive (count 0)", () => {
		const tabId = ExRTabId.CrewmateTab;
		const categoryId = 100;
		const chanceId = getUniqueOptionId(tabId, categoryId, SPAWN_RATE_OPTION_ID);
		const countId = getUniqueOptionId(tabId, categoryId, SPAWN_COUNT_OPTION_ID);

		exrOptionMetaData.categories[categoryId] = {
			name: "Test Role",
			tabId: tabId,
			categoryColors: [],
		};

		useStore.getState().setExROptions(
			{
				[chanceId]: { selection: 1, values: [0, 50, 100] },
				[countId]: { selection: 0, values: [0, 1, 2] },
			},
			{},
		);

		const { container } = render(<ExRRoleSummaryRow categoryId={categoryId} />);
		expect(container.firstChild).toBeNull();
	});
});
