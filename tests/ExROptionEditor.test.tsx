import { fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionEditor } from "../src/feature/exr/ExROptionEditor";
import { resetExrOptionMetaData } from "../src/logics/api";
import { getAllOptions, resetApiCache } from "../src/logics/api.store";
import type { AuOptionCategoryDto, ExRTabDto } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExROptionEditor", () => {
	const mockExRData: ExRTabDto[] = [
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
							Id: 50,
							IsActive: true,
							TranslatedName: "Spawn Rate",
							Selection: 1,
							Format: "{0}",
							RangeMeta: { Type: "Int32", Values: [0, 100] },
							Childs: [
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
			],
		},
	];

	beforeEach(async () => {
		resetApiCache();
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		const mockAuData: AuOptionCategoryDto[] = [
			{
				TranslatedTitle: "Au Category",
				Options: [
					{
						TranslatedTitle: "Au Option",
						TranslatedFormat: "{0}",
						Value: 0,
						Info: { ValueType: 2, OptionName: 1 },
						Range: [0, 1, 2],
					},
				],
			},
		];

		vi.stubGlobal(
			"fetch",
			vi.fn().mockImplementation((url: string) => {
				if (url.endsWith("/exr/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue(mockExRData),
					} as Response);
				}
				if (url.endsWith("/au/option/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue(mockAuData),
					} as Response);
				}
				if (url.endsWith("/au/translation/batch/optionunit/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([]),
					} as Response);
				}
				if (url.endsWith("/au/translation/batch/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue([]),
					} as Response);
				}
				if (url.endsWith("/exr/role/filter/")) {
					return Promise.resolve({
						ok: true,
						json: vi.fn().mockResolvedValue({
							FilterSet: {},
							FilterRoleId: [],
							NormalRoleId: {},
							CombinationId: {},
							GhostRoleId: {},
						}),
					} as Response);
				}
				return Promise.reject(new Error(`Unhandled URL: ${url}`));
			}),
		);

		await getAllOptions();
	});

	it("should only show visible categories (not empty, at least one active option) and hide preset", () => {
		render(
			<Suspense fallback={<div>Loading...</div>}>
				<ExROptionEditor />
			</Suspense>,
		);

		expect(screen.getByText("Category 1")).toBeInTheDocument();
		expect(screen.queryByText("Empty Category")).not.toBeInTheDocument();
		expect(screen.queryByText("Inactive Category")).not.toBeInTheDocument();

		// プリセットカテゴリは非表示になっていることを確認
		expect(screen.queryByText("Preset Category")).not.toBeInTheDocument();
	});

	it("should switch tabs and show correct categories", () => {
		const { unmount } = render(
			<Suspense fallback={<div>Loading...</div>}>
				<ExROptionEditor />
			</Suspense>,
		);

		expect(screen.getByText("Category 1")).toBeInTheDocument();

		const tab2Button = screen.getByText("Tab 2");
		fireEvent.click(tab2Button);

		expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
		expect(screen.getByText("Category 2")).toBeInTheDocument();
		unmount();
	});

	it("should toggle accordion and show options UI", () => {
		const { unmount } = render(
			<Suspense fallback={<div>Loading...</div>}>
				<ExROptionEditor />
			</Suspense>,
		);

		const categoryButton = screen.getByText("Category 1");

		fireEvent.click(categoryButton);

		// オプション名が表示されていることを確認
		expect(screen.getByText("Option 1")).toBeInTheDocument();

		// スライダー（input[type="range"]）が存在することを確認
		expect(screen.getByRole("slider")).toBeInTheDocument();

		// 現在の値が表示されていることを確認
		// uniqueOptionId: 0*100M + 1*10k + 101 = 10101
		// mockExRDataでは selection: 0 なので "0"
		expect(screen.getAllByDisplayValue("0")).toHaveLength(2);

		unmount();
	});
});
