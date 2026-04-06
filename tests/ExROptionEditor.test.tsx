import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionEditor } from "../src/feature/ExROptionEditor";
import * as api from "../src/logics/api";
import type { ExRTabDto } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExROptionEditor", () => {
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
		vi.restoreAllMocks();
		useStore.getState().resetViewer();
		vi.spyOn(api, "getExrOptions").mockResolvedValue(mockData);
		vi.spyOn(api, "getExrTabOptions").mockImplementation((id) => {
			const tab = mockData.find((t) => {
				return t.Id === id;
			});
			return tab
				? Promise.resolve(tab)
				: Promise.reject(new Error("Not found"));
		});
		vi.spyOn(api, "getExrCategoryOptions").mockImplementation((id) => {
			for (const tab of mockData) {
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

	it("should only show visible categories (not empty, at least one active option) and hide preset", async () => {
		await act(async () => {
			render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>,
			);
		});

		expect(await screen.findByText("Category 1")).toBeInTheDocument();
		expect(screen.queryByText("Empty Category")).not.toBeInTheDocument();
		expect(screen.queryByText("Inactive Category")).not.toBeInTheDocument();

		// プリセットカテゴリは非表示になっていることを確認
		expect(screen.queryByText("Preset Category")).not.toBeInTheDocument();
	});

	it("should switch tabs and show correct categories", async () => {
		let unmount: () => void;
		await act(async () => {
			const result = render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>,
			);
			unmount = result.unmount;
		});

		expect(await screen.findByText("Category 1")).toBeInTheDocument();

		const tab2Button = screen.getByText("Tab 2");
		await act(async () => {
			fireEvent.click(tab2Button);
		});

		expect(await screen.findByText("Category 2")).toBeInTheDocument();
		expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
		unmount?.();
	});

	it("should toggle accordion and show options UI", async () => {
		let unmount: () => void;
		await act(async () => {
			const result = render(
				<Suspense fallback={<div>Loading...</div>}>
					<ExROptionEditor />
				</Suspense>,
			);
			unmount = result.unmount;
		});

		const categoryButton = await screen.findByText("Category 1");

		await act(async () => {
			fireEvent.click(categoryButton);
		});

		// オプション名が表示されていることを確認
		expect(await screen.findByText("Option 1")).toBeInTheDocument();

		// スライダー（input[type="range"]）が存在することを確認
		expect(screen.getByRole("slider")).toBeInTheDocument();

		// 現在の値が表示されていることを確認
		expect(screen.getAllByDisplayValue("0")).toHaveLength(2);

		unmount?.();
	});
});
