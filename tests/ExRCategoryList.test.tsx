import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryList } from "../src/feature/ExRCategoryList";
import * as api from "../src/logics/api";
import { type ExRTabDto, OptionTab } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRCategoryList Component Selection", () => {
	const mockTabs: ExRTabDto[] = [
		{
			Id: OptionTab.GeneralTab,
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
			Id: OptionTab.CrewmateTab,
			Name: "Crewmate",
			Categories: [
				{
					Id: 2,
					Name: "Sheriff",
					Options: [
						{
							Id: 50,
							IsActive: true,
							TranslatedName: "Spawn Rate",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 100] },
							Childs: [],
						},
						{
							Id: 51,
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
		vi.restoreAllMocks();
		useStore.getState().resetViewer();

		vi.spyOn(api, "getExrOptions").mockResolvedValue(mockTabs);
		vi.spyOn(api, "getExrTabOptions").mockImplementation((id) => {
			const tab = mockTabs.find((t) => {
				return t.Id === id;
			});
			return tab
				? Promise.resolve(tab)
				: Promise.reject(new Error("Not found"));
		});
		vi.spyOn(api, "getExrCategoryOptions").mockImplementation((id) => {
			for (const tab of mockTabs) {
				const cat = tab.Categories.find((c) => {
					return c.Id === id;
				});
				if (cat) {
					return Promise.resolve(cat);
				}
			}
			return Promise.reject(new Error("Not found"));
		});
	});

	it("renders ExRStandardCategoryItem for General Tab", async () => {
		useStore.getState().setSelectedExRTabId(OptionTab.GeneralTab);
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>,
			);
		});

		expect(await screen.findByText("General Category")).toBeInTheDocument();
		expect(screen.queryByText("レート")).not.toBeInTheDocument();
	});

	it("renders ExRRoleCategoryItem for Role Tab", async () => {
		useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>,
			);
		});

		expect(await screen.findByText("Sheriff")).toBeInTheDocument();
		expect(screen.getByText("レート")).toBeInTheDocument();
	});

	it("filters out 50 and 51 from role category body", async () => {
		useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
		useStore.getState().TEMP_updateExROptionSelection("2-50", 1);
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>,
			);
		});

		const toggleButton = await screen.findByRole("button", {
			name: /Sheriff/i,
		});
		await act(async () => {
			fireEvent.click(toggleButton);
		});

		expect(await screen.findByText("Kill CD")).toBeInTheDocument();
		expect(screen.queryByText("Spawn Rate")).not.toBeInTheDocument();
		expect(screen.queryByText("Spawn Count")).not.toBeInTheDocument();
	});
});
