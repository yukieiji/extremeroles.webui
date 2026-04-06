import { fireEvent, render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
} from "vitest";
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

	const server = setupServer(
		http.get("/exr/option/", () => {
			return HttpResponse.json(mockData);
		}),
	);

	beforeAll(() => {
		server.listen();
	});

	afterEach(() => {
		server.resetHandlers();
	});

	afterAll(() => {
		server.close();
	});

	beforeEach(() => {
		useStore.getState().resetViewer();
	});

	it("should only show visible categories (not empty, at least one active option) and hide preset", async () => {
		server.use(
			http.get("/exr/option/", () => {
				return HttpResponse.json(mockData);
			}),
		);
		render(<ExROptionEditor />);

		expect(await screen.findByText("Category 1")).toBeInTheDocument();
		expect(screen.queryByText("Empty Category")).not.toBeInTheDocument();
		expect(screen.queryByText("Inactive Category")).not.toBeInTheDocument();

		// プリセットカテゴリは非表示になっていることを確認
		expect(screen.queryByText("Preset Category")).not.toBeInTheDocument();
	});

	it("should switch tabs and show correct categories", async () => {
		server.use(
			http.get("/exr/option/", () => {
				return HttpResponse.json(mockData);
			}),
		);
		const { unmount } = render(<ExROptionEditor />);

		expect(await screen.findByText("Category 1")).toBeInTheDocument();

		const tab2Button = await screen.findByText("Tab 2");
		fireEvent.click(tab2Button);

		expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
		expect(await screen.findByText("Category 2")).toBeInTheDocument();
		unmount();
	});

	it("should toggle accordion and show options UI", async () => {
		server.use(
			http.get("/exr/option/", () => {
				return HttpResponse.json(mockData);
			}),
		);
		const { unmount } = render(<ExROptionEditor />);

		const categoryButton = await screen.findByText("Category 1");

		fireEvent.click(categoryButton);

		// オプション名が表示されていることを確認
		expect(await screen.findByText("Option 1")).toBeInTheDocument();

		// スライダー（input[type="range"]）が存在することを確認
		expect(screen.getByRole("slider")).toBeInTheDocument();

		// 現在の値が表示されていることを確認
		expect(screen.getAllByDisplayValue("0")).toHaveLength(2);

		unmount();
	});
});
