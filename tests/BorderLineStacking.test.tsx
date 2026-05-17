import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryOptionList } from "@/feature/exr/ExRCategoryOptionList";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

// BorderLine の描画を確認するために、BorderLine コンポーネントをモック化します
vi.mock("@/components/parts/BorderLine", () => ({
	BorderLine: () => <hr data-testid="border-line" />,
}));

describe("ExRCategoryOptionList - BorderLine stacking issue", () => {
	const categoryId = 1;
	const optionId1 = 101;
	const optionId2 = 102;
	const optionId3 = 103;
	const tabId = 0;

	const uniqueId1 = getUniqueOptionId(tabId, categoryId, optionId1);
	const uniqueId2 = getUniqueOptionId(tabId, categoryId, optionId2);
	const uniqueId3 = getUniqueOptionId(tabId, categoryId, optionId3);

	beforeEach(() => {
		resetExrOptionMetaData();
		useStore.getState().resetViewer();

		exrOptionMetaData.options[uniqueId1] = {
			metaData: { translatedName: "Option 1", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};
		exrOptionMetaData.options[uniqueId2] = {
			metaData: { translatedName: "Option 2", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};
		exrOptionMetaData.options[uniqueId3] = {
			metaData: { translatedName: "Option 3", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore.getState().setExROptions(
			{
				[uniqueId1]: { selection: 0, values: [0, 1] },
				[uniqueId2]: { selection: 0, values: [0, 1] },
				[uniqueId3]: { selection: 0, values: [0, 1] },
			},
			{
				[uniqueId1]: true,
				[uniqueId2]: true,
				[uniqueId3]: true,
			},
		);
	});

	it("renders BorderLine between visible options", async () => {
		render(
			<ExRCategoryOptionList
				categoryId={categoryId}
				uniqueOptionIds={[uniqueId1, uniqueId2, uniqueId3]}
			/>,
		);

		// Option 1, Option 2, Option 3 が全てアクティブな場合、
		// 1 と 2 の間、2 と 3 の間に BorderLine が表示されるはず (合計 2 つ)
		const borderLines = screen.getAllByTestId("border-line");
		expect(borderLines).toHaveLength(2);
	});

	it("does not render BorderLine when intermediate option is inactive", async () => {
		// Option 2 を非アクティブにする
		await act(async () => {
			useStore.getState().setExROptions(useStore.getState().exrValue, {
				[uniqueId1]: true,
				[uniqueId2]: false,
				[uniqueId3]: true,
			});
		});

		render(
			<ExRCategoryOptionList
				categoryId={categoryId}
				uniqueOptionIds={[uniqueId1, uniqueId2, uniqueId3]}
			/>,
		);

		// Option 1 と Option 3 だけが表示される。
		// その間には 1 つだけ BorderLine が表示されるべき。
		const borderLines = screen.getAllByTestId("border-line");
		expect(borderLines).toHaveLength(1);
	});

	it("renders no BorderLine when only one option is visible", async () => {
		// Option 2, 3 を非アクティブにする
		await act(async () => {
			useStore.getState().setExROptions(useStore.getState().exrValue, {
				[uniqueId1]: true,
				[uniqueId2]: false,
				[uniqueId3]: false,
			});
		});

		render(
			<ExRCategoryOptionList
				categoryId={categoryId}
				uniqueOptionIds={[uniqueId1, uniqueId2, uniqueId3]}
			/>,
		);

		const borderLines = screen.queryAllByTestId("border-line");
		expect(borderLines).toHaveLength(0);
	});
});
