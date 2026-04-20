import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryList } from "../src/feature/ExRCategoryList";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId, parseUniqueOptionId } from "../src/logics/optionUtils";
import {
	type ExRTabDto,
	OptionTab,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRCategoryList Component Selection", () => {
	const mockTabs: ExRTabDto[] = [
		{
			Id: OptionTab.GeneralTab, // Tab 0
			Name: "General",
			Categories: [
				{
					Id: 1,
					Name: "General Category",
					Options: [
						{
							Id: 101,
							IsActive: true,
							TranslatedName: "General Option",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 1] },
							Childs: [],
						},
					],
				},
			],
		},
		{
			Id: OptionTab.CrewmateTab, // Tab 1
			Name: "Crewmate",
			Categories: [
				{
					Id: 2,
					Name: "Sheriff",
					Options: [
						{
							Id: SPAWN_RATE_OPTION_ID,
							IsActive: true,
							TranslatedName: "Spawn Rate",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 100] },
							Childs: [],
						},
						{
							Id: SPAWN_COUNT_OPTION_ID,
							IsActive: true,
							TranslatedName: "Spawn Count",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 1] },
							Childs: [],
						},
						{
							Id: 201,
							IsActive: true,
							TranslatedName: "Kill CD",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [10, 20] },
							Childs: [],
						},
					],
				},
			],
		},
	];

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		// exrOptionMetaData のセットアップ
		for (const tab of mockTabs) {
			exrOptionMetaData.tabIdMap[tab.Id] = tab.Categories.map((c) => c.Id);
			for (const cat of tab.Categories) {
				exrOptionMetaData.categoryInfo[cat.Id] = cat.Name;
				if (tab.Id === OptionTab.GeneralTab) {
					exrOptionMetaData.globalCategoryIdTopLevelMap[cat.Id] =
						cat.Options.map((o) => o.Id);
				}

				for (const opt of cat.Options) {
					const uniqueId = getUniqueOptionId(tab.Id, cat.Id, opt.Id);
					exrOptionMetaData.optionMetaData[uniqueId] = {
						translatedName: opt.TranslatedName,
						format: opt.Format,
						type: opt.RangeMeta.Type,
					};
					useStore.getState().setExROptions(
						{
							...useStore.getState().valueData,
							[uniqueId]: {
								selection: opt.Selection,
								values: opt.RangeMeta.Values,
							},
						},
						{
							...useStore.getState().isOptionActive,
							[uniqueId]: opt.IsActive,
							// バグ回避用の optionId での登録
							[opt.Id]: opt.IsActive,
						},
					);

					// Role Tab の場合は SPAWN_RATE_OPTION_ID の子として登録
					if (tab.Id !== OptionTab.GeneralTab) {
						const rateUniqueId = getUniqueOptionId(
							tab.Id,
							cat.Id,
							SPAWN_RATE_OPTION_ID,
						);
						if (!exrOptionMetaData.childOptionMap[rateUniqueId]) {
							exrOptionMetaData.childOptionMap[rateUniqueId] = [];
						}
						if (
							opt.Id !== SPAWN_RATE_OPTION_ID &&
							!exrOptionMetaData.childOptionMap[rateUniqueId].includes(uniqueId)
						) {
							exrOptionMetaData.childOptionMap[rateUniqueId].push(uniqueId);
						}
					}
				}
			}
		}
	});

	it("renders ExRStandardCategoryItem for General Tab", () => {
		useStore.getState().setSelectedExRTabId(OptionTab.GeneralTab);
		render(<ExRCategoryList />);

		// General Tab: Should render standard category
		expect(screen.getByText("General Category")).toBeInTheDocument();

		// Header should NOT have spawn controls
		expect(screen.queryByText("レート")).not.toBeInTheDocument();
	});

	it("renders ExRRoleCategoryItem for Role Tab", () => {
		useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
		render(<ExRCategoryList />);

		// Role Tab: Should render specialized category item
		expect(screen.getByText("Sheriff")).toBeInTheDocument();

		// Header should have spawn rate control (レート)
		expect(screen.getByText("レート")).toBeInTheDocument();
	});

	it("filters out 50 and 51 from role category body", async () => {
		useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);

		// Mock updateExROptionSelection to update the store manually
		vi.spyOn(useStore.getState(), "updateExROptionSelection").mockImplementation(
			async (uId, selection) => {
				useStore.getState().setExROptions(
					{
						...useStore.getState().valueData,
						[uId]: { selection, values: [0, 100] },
					},
					useStore.getState().isOptionActive,
				);
			},
		);

		// Set a non-zero spawn rate so the accordion is enabled
		await useStore
			.getState()
			.updateExROptionSelection(
				getUniqueOptionId(OptionTab.CrewmateTab, 2, SPAWN_RATE_OPTION_ID),
				1,
			); // Category 2, Option 50, Index 1 (Value 100)
		render(<ExRCategoryList />);

		// Open accordion - RoleCategoryItem uses a custom layout,
		// we find the toggle button by role.
		const toggleButton = screen.getByRole("button", { name: /Sheriff/i });
		fireEvent.click(toggleButton);

		// Body content should be visible after click
		// ExRRoleCategoryItem renders options list when isOpen is true
		expect(screen.getByText("Kill CD")).toBeInTheDocument();

		// 50 and 51 should be filtered out from the body
		expect(screen.queryByText("Spawn Rate")).not.toBeInTheDocument();
		expect(screen.queryByText("Spawn Count")).not.toBeInTheDocument();
	});
});
