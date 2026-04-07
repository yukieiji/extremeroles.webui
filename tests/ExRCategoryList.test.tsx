import { fireEvent, render, screen, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { Suspense } from "react";
import { ExRCategoryList } from "../src/feature/ExRCategoryList";
import { type ExRTabDto, OptionTab } from "../src/type";
import { useStore } from "../src/useStore";
import { server } from "./msw-server";
import { resetApiCache } from "../src/logics/api";

describe("ExRCategoryList Component Selection", { timeout: 15000 }, () => {
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
		resetApiCache();
		useStore.getState().resetViewer();
		server.use(
			http.get("/exr/option/", () => HttpResponse.json(mockTabs))
		);
	});

	it("renders ExRStandardCategoryItem for General Tab", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.GeneralTab);
		});

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>
			);
		});

		expect(await screen.findByText("General Category", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("renders ExRRoleCategoryItem for Role Tab", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
		});

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>
			);
		});

		expect(await screen.findByText("Sheriff", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("filters out 50 and 51 from role category body", async () => {
		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
			useStore.getState().TEMP_updateExROptionSelection("2-50", 1);
		});

		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExRCategoryList />
				</Suspense>
			);
		});

		const toggleButton = await screen.findByRole("button", { name: /Sheriff/i }, { timeout: 5000 });

		await act(async () => {
			fireEvent.click(toggleButton);
		});

		expect(await screen.findByText("Kill CD", {}, { timeout: 5000 })).toBeInTheDocument();
	});
});
