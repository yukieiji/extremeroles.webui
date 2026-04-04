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
		useStore.getState().resetViewer();
		vi.restoreAllMocks();
	});

	const renderWithSuspense = (ui: React.ReactElement) => {
		return render(<Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>);
	};

	it("renders ExRStandardCategoryItem for General Tab", async () => {
		const promises: Record<number, Promise<ExRTabDto>> = {};
		vi.spyOn(api, "getExrTabOptions").mockImplementation((id) => {
			if (!promises[id]) {
				const tab = mockTabs.find((t) => t.Id === id) || mockTabs[0];
				promises[id] = Promise.resolve(tab);
			}
			return promises[id];
		});

		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.GeneralTab);
			renderWithSuspense(<ExRCategoryList />);
		});

		// Wait for Suspense to resolve
		expect(await screen.findByText("General Category")).toBeInTheDocument();

		// Header should NOT have spawn controls
		expect(screen.queryByText("レート")).not.toBeInTheDocument();
	});

	it("renders ExRRoleCategoryItem for Role Tab", async () => {
		const promises: Record<number, Promise<ExRTabDto>> = {};
		vi.spyOn(api, "getExrTabOptions").mockImplementation((id) => {
			if (!promises[id]) {
				const tab = mockTabs.find((t) => t.Id === id) || mockTabs[0];
				promises[id] = Promise.resolve(tab);
			}
			return promises[id];
		});

		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
			renderWithSuspense(<ExRCategoryList />);
		});

		expect(await screen.findByText("Sheriff")).toBeInTheDocument();

		// Header should have spawn rate control (レート)
		expect(screen.getByText("レート")).toBeInTheDocument();
	});

	it("filters out 50 and 51 from role category body", async () => {
		const testMockTabs = JSON.parse(JSON.stringify(mockTabs));
		// Set a non-zero spawn rate so the accordion is enabled
		testMockTabs[1].Categories[0].Options[0].Selection = 1;

		const promises: Record<number, Promise<ExRTabDto>> = {};
		vi.spyOn(api, "getExrTabOptions").mockImplementation((id) => {
			if (!promises[id]) {
				const tab =
					testMockTabs.find((t: ExRTabDto) => t.Id === id) || testMockTabs[0];
				promises[id] = Promise.resolve(tab);
			}
			return promises[id];
		});

		await act(async () => {
			useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
			renderWithSuspense(<ExRCategoryList />);
		});

		expect(await screen.findByText("Sheriff")).toBeInTheDocument();

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
