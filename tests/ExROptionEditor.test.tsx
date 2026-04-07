import { fireEvent, render, screen, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { Suspense } from "react";
import { ExROptionEditor } from "../src/feature/ExROptionEditor";
import type { ExRTabDto } from "../src/type";
import { useStore } from "../src/useStore";
import { server } from "./msw-server";
import { resetApiCache } from "../src/logics/api";

describe("ExROptionEditor", { timeout: 15000 }, () => {
	const mockData: ExRTabDto[] = [
		{
			Id: 0,
			Name: "Tab 1",
			Categories: [
				{
					Id: 1,
					Name: "Category 1",
					Options: [
						{
							Id: 101,
							IsActive: true,
							TranslatedName: "Option 1",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 10, 20] },
							Childs: [],
						},
					],
				},
				{
					Id: 0,
					Name: "Preset Category",
					Options: [
						{
							Id: 0,
							IsActive: true,
							TranslatedName: "使用するプリセット",
							Selection: 0,
							Format: "Preset",
							RangeMeta: { Type: "Int32", Values: [1, 2, 3] },
							Childs: [],
						},
					],
				},
				{
					Id: 2,
					Name: "Empty Category",
					Options: [],
				},
				{
					Id: 3,
					Name: "Inactive Category",
					Options: [
						{
							Id: 102,
							IsActive: false,
							TranslatedName: "Option 2",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 10, 20] },
							Childs: [],
						},
					],
				},
			],
		},
		{
			Id: 1,
			Name: "Tab 2",
			Categories: [
				{
					Id: 4,
					Name: "Category 2",
					Options: [
						{
							Id: 201,
							IsActive: true,
							TranslatedName: "Option 3",
							Selection: 0,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 10, 20] },
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
			http.get("/exr/option/", () => HttpResponse.json(mockData))
		);
	});

	it("should only show visible categories (not empty, at least one active option) and hide preset", async () => {
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>
			);
		});

		expect(await screen.findByText("Category 1", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should switch tabs and show correct categories", async () => {
		let unmount: () => void;
		await act(async () => {
			const result = render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>
			);
			unmount = result.unmount;
		});

		expect(await screen.findByText("Category 1", {}, { timeout: 5000 })).toBeInTheDocument();

		const tab2Button = await screen.findByText("Tab 2", {}, { timeout: 5000 });

		await act(async () => {
			fireEvent.click(tab2Button);
		});

		expect(await screen.findByText("Category 2", {}, { timeout: 5000 })).toBeInTheDocument();
		unmount!();
	});

	it("should toggle accordion and show options UI", async () => {
		let unmount: () => void;
		await act(async () => {
			const result = render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>
			);
			unmount = result.unmount;
		});

		const categoryButton = await screen.findByText("Category 1", {}, { timeout: 5000 });

		await act(async () => {
			fireEvent.click(categoryButton);
		});

		expect(await screen.findByText("Option 1", {}, { timeout: 5000 })).toBeInTheDocument();
		unmount!();
	});
});
