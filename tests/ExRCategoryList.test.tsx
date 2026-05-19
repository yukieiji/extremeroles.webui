import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryList } from "@/feature/exr/ExRCategoryList";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { useUpdateExROptionSelection } from "@/logics/api.store";
import { getUniqueOptionId } from "@/logics/optionUtils";
import type { UpdateExRArg } from "@/type";
import {
	type ExRTabDto,
	ExRTabId,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "@/type";
import { useStore } from "@/useStore";

vi.mock("@/logics/api.store", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/logics/api.store")>();
	return {
		...actual,
		useUpdateExROptionSelection: vi.fn(),
	};
});

describe("ExRCategoryList Component Selection", () => {
	const mockTabs: ExRTabDto[] = [
		{
			Id: ExRTabId.GeneralTab, // Tab 0
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
			Id: ExRTabId.CrewmateTab, // Tab 1
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
			exrOptionMetaData.tabs[tab.Id] = {
				name: tab.Name,
				categoryIds: tab.Categories.map((c) => c.Id),
			};
			for (const cat of tab.Categories) {
				exrOptionMetaData.categories[cat.Id] = {
					name: cat.Name,
					tabId: tab.Id,
				};
				if (tab.Id === ExRTabId.GeneralTab) {
					exrOptionMetaData.globalCategoryIdTopLevelMap[cat.Id] =
						cat.Options.map((o) => getUniqueOptionId(tab.Id, cat.Id, o.Id));
				}

				for (const opt of cat.Options) {
					const uniqueId = getUniqueOptionId(tab.Id, cat.Id, opt.Id);
					exrOptionMetaData.options[uniqueId] = {
						metaData: {
							translatedName: opt.TranslatedName,
							format: opt.Format,
							type: opt.RangeMeta.Type,
						},
						childOptionIds: [],
					};
					useStore.getState().setExROptions(
						{
							...useStore.getState().exrValue,
							[uniqueId]: {
								selection: opt.Selection,
								values: opt.RangeMeta.Values,
							},
						},
						{
							...useStore.getState().isExROptionActive,
							[uniqueId]: opt.IsActive,
							// バグ回避用の optionId での登録
							[opt.Id]: opt.IsActive,
						},
					);

					// Role Tab の場合は SPAWN_RATE_OPTION_ID の子として登録
					if (tab.Id !== ExRTabId.GeneralTab) {
						const rateUniqueId = getUniqueOptionId(
							tab.Id,
							cat.Id,
							SPAWN_RATE_OPTION_ID,
						);
						if (!exrOptionMetaData.options[rateUniqueId]) {
							exrOptionMetaData.options[rateUniqueId] = {
								metaData: { translatedName: "", format: "", type: "" },
								childOptionIds: [],
							};
						}
						if (
							opt.Id !== SPAWN_RATE_OPTION_ID &&
							!exrOptionMetaData.options[rateUniqueId].childOptionIds.includes(
								uniqueId,
							)
						) {
							exrOptionMetaData.options[rateUniqueId].childOptionIds.push(
								uniqueId,
							);
						}
					}
				}
			}
		}
	});

	it("renders ExRStandardCategoryItem for General Tab", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(ExRTabId.GeneralTab);
		});
		await act(async () => {
			render(<ExRCategoryList />);
		});

		// General Tab: Should render standard category
		expect(screen.getByText("General Category")).toBeInTheDocument();

		// Header should NOT have spawn controls
		expect(screen.queryByText("レート")).not.toBeInTheDocument();
	});

	it("renders ExRRoleCategoryItem for Role Tab", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(ExRTabId.CrewmateTab);
		});
		await act(async () => {
			render(<ExRCategoryList />);
		});

		// Role Tab: Should render specialized category item
		expect(screen.getByText("Sheriff")).toBeInTheDocument();

		// Header should have spawn rate control (レート)
		expect(screen.getByText("レート")).toBeInTheDocument();
	});

	it("filters out 50 and 51 from role category body", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(ExRTabId.CrewmateTab);
		});

		// Mock useUpdateExROptionSelection to update the store manually
		vi.mocked(useUpdateExROptionSelection).mockReturnValue(
			async (...args: UpdateExRArg[]) => {
				const nextExrValue = { ...useStore.getState().exrValue };
				for (const x of args) {
					nextExrValue[x.uniqueOptionId] = {
						selection: x.selection,
						values: [0, 100],
					};
				}
				useStore
					.getState()
					.setExROptions(nextExrValue, useStore.getState().isExROptionActive);
			},
		);

		const updateExRSelection = useUpdateExROptionSelection();

		// Set a non-zero spawn rate so the accordion is enabled
		await act(async () => {
			await updateExRSelection({
				uniqueOptionId: getUniqueOptionId(
					ExRTabId.CrewmateTab,
					2,
					SPAWN_RATE_OPTION_ID,
				),
				selection: 1,
			}); // Category 2, Option 50, Index 1 (Value 100)
		});

		await act(async () => {
			render(<ExRCategoryList />);
		});

		// Open accordion - RoleCategoryItem uses a custom layout,
		// we find the toggle button by role.
		const toggleButton = screen.getByRole("button", { name: /Sheriff/i });
		await act(async () => {
			fireEvent.click(toggleButton);
		});

		// Body content should be visible after click
		// ExRRoleCategoryItem renders options list when isOpen is true
		expect(screen.getByText("Kill CD")).toBeInTheDocument();

		// 50 and 51 should be filtered out from the body
		expect(screen.queryByText("Spawn Rate")).not.toBeInTheDocument();
		expect(screen.queryByText("Spawn Count")).not.toBeInTheDocument();
	});
});
