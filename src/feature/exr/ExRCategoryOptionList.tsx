import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { BorderLine } from "@/components/parts/BorderLine";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionEditorOptionRowGroupLayout } from "@/components/parts/OptionEditorOptionRowLayout";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import { groupOptionPairs } from "@/logics/optionUtils";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExRPairedOptionItem } from "./ExRPairedOptionItem";

const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryOptionListProps {
	categoryId: number;
	uniqueOptionIds: UniqueOptionId[];
}

/**
 * カテゴリ内のオプション一覧を表示する共通コンポーネント
 */
export function ExRCategoryOptionList({
	categoryId,
	uniqueOptionIds,
}: ExRCategoryOptionListProps) {
	const shouldGroup = GROUPED_CATEGORY_IDS.includes(categoryId);
	const groupedItems = useMemo(
		() => (shouldGroup ? groupOptionPairs(uniqueOptionIds) : uniqueOptionIds),
		[shouldGroup, uniqueOptionIds],
	);

	const visibleItems = useStore(
		useShallow((state) =>
			groupedItems.filter((item) => {
				if (typeof item === "number") {
					return state.isExROptionActive[item];
				}
				return true;
			}),
		),
	);

	// visibleItemsはOptionIdの配列か、ペアオプションの情報を持つオブジェクトの配列になる
	return (
		<OptionEditorOptionRowGroupLayout>
			{visibleItems.map((item, index) => {
				const isNumber = typeof item === "number";
				const key = isNumber ? item : `pair-${item.baseName}`;
				return (
					<div key={key}>
						{index !== 0 && <BorderLine />}
						{isNumber ? (
							<ExROptionItem uniqueOptionId={item} />
						) : (
							<OptionRowContainer
								leading={<LargePoint />}
								depth={0}
								indentMultiplier={1}
								content={
									<ExRPairedOptionItem
										baseName={item.baseName}
										minData={item.minData}
										maxData={item.maxData}
									/>
								}
							/>
						)}
					</div>
				);
			})}
		</OptionEditorOptionRowGroupLayout>
	);
}
