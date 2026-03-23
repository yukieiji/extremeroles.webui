import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ExROptionEditor } from "../src/feature/ExROptionEditor";
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
		useStore.getState().resetViewer();
	});

	it("should only show visible categories (not empty, at least one active option) and hide preset", () => {
		render(<ExROptionEditor data={mockData} />);

		expect(screen.getByText("Category 1")).toBeInTheDocument();
		expect(screen.queryByText("Empty Category")).not.toBeInTheDocument();
		expect(screen.queryByText("Inactive Category")).not.toBeInTheDocument();

		// プリセットカテゴリは非表示になっていることを確認
		expect(screen.queryByText("Preset Category")).not.toBeInTheDocument();
	});

	it("should switch tabs and show correct categories", () => {
		const { unmount } = render(<ExROptionEditor data={mockData} />);

		expect(screen.getByText("Category 1")).toBeInTheDocument();

		const tab2Button = screen.getByText("Tab 2");
		fireEvent.click(tab2Button);

		expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
		expect(screen.getByText("Category 2")).toBeInTheDocument();
		unmount();
	});

	it("should toggle accordion and show options UI", () => {
		const { unmount } = render(<ExROptionEditor data={mockData} />);

		const categoryButton = screen.getByText("Category 1");

		fireEvent.click(categoryButton);

		// オプション名が表示されていることを確認
		expect(screen.getByText("Option 1")).toBeInTheDocument();

		// スライダー（input[type="range"]）が存在することを確認
		expect(screen.getByRole("slider")).toBeInTheDocument();

		// 現在の値が表示されていることを確認
		expect(screen.getAllByDisplayValue("0")).toHaveLength(2);

		unmount();
	});
});
