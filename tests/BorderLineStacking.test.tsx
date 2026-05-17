import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExRCategoryOptionList } from "@/feature/exr/ExRCategoryOptionList";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

// BorderLine の描画を確認するために、BorderLine コンポーネントをモック化します
// className を受け取り、それを data-attribute に変換して DOM に反映させます。
// これにより CSS の :first-child 擬似クラスなどは機能しませんが、
// ロジックとして BorderLine が適切な数だけ配置されているかは確認できます。
vi.mock("@/components/parts/BorderLine", () => ({
	BorderLine: ({ className }: { className?: string }) => (
		<hr data-testid="border-line" className={className} />
	),
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

	it("renders BorderLine with withBorder prop", async () => {
		render(
			<ExRCategoryOptionList
				categoryId={categoryId}
				uniqueOptionIds={[uniqueId1, uniqueId2, uniqueId3]}
			/>,
		);

		// 全てアクティブな場合、各アイテムの前に BorderLine が配置される。
		// index !== 0 の判定により、2番目と3番目の前に配置されるため、合計 2 つ。
		const borderLines = screen.getAllByTestId("border-line");
		expect(borderLines).toHaveLength(2);
	});

	it("renders correct number of BorderLines when intermediate option is inactive", async () => {
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

		// Option 1 は withBorder=false (index 0)
		// Option 2 は 非アクティブで null を返す
		// Option 3 は withBorder=true (index 2)
		// そのため、結果として表示される BorderLine は 1 つだけ。
		const borderLines = screen.getAllByTestId("border-line");
		expect(borderLines).toHaveLength(1);
	});
});
