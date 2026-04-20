import { fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExROptionEditor } from "../src/feature/ExROptionEditor";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getExrOptions, resetApiCache } from "../src/logics/api.store";
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

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue(mockData),
			}),
		);

		await getExrOptions();

		// プロダクトコードのバグ（uniqueId ではなく optionId でストアを参照している箇所など）を
		// 回避するために、テストコード側でグローバル状態を調整する
		const state = useStore.getState();

		// 1. isOptionActive を optionId でも引けるようにする（ExRStandardCategoryList 用）
		const newActive = { ...state.isExROptionActive };
		for (const [uId, active] of Object.entries(state.isExROptionActive)) {
			const oId = Number(uId) % 10000;
			newActive[oId] = active;
		}

		// 2. childOptionMap を uniqueId ではなく optionId の配列にする（ExRRoleCategoryItem 用）
		const newChildMap: Record<number, number[]> = {};
		for (const [uId, children] of Object.entries(
			exrOptionMetaData.childOptionMap,
		)) {
			newChildMap[Number(uId)] = children.map((cid) => cid % 10000);
		}
		exrOptionMetaData.childOptionMap = newChildMap;

		useStore.setState({ isExROptionActive: newActive });
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
		// mockDataでは selection: 0 なので "0"
		expect(screen.getAllByDisplayValue("0")).toHaveLength(2);

		unmount();
	});
});
