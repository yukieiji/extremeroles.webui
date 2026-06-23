import { useShallow } from "zustand/react/shallow";
import { BorderLine } from "@/components/parts/BorderLine";
import { OptionEditorOptionRowGroupLayout } from "@/components/parts/OptionEditorOptionRowLayout";
import { groupOptionPairs } from "@/logics/optionUtils";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExRPairedOptionRow } from "./ExRPairedOptionRow";

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
	const activeUniqueOptionIds = useStore(
		useShallow((state) =>
			uniqueOptionIds.filter((id) => state.isExROptionActive[id]),
		),
	);
	const shouldGroup = GROUPED_CATEGORY_IDS.includes(categoryId);
	const groupedItems = shouldGroup
		? groupOptionPairs(activeUniqueOptionIds)
		: activeUniqueOptionIds;

	// gropedItemsはOptionIdの配列か、ペアオプションの情報を持つオブジェクトの配列になる
	return (
		<OptionEditorOptionRowGroupLayout>
			{groupedItems.map((item, index) => {
				const isNumber = typeof item === "number";
				const key = isNumber ? item : `pair-${item.baseName}`;
				return (
					<div key={key}>
						{index !== 0 && <BorderLine />}
						{isNumber ? (
							<ExROptionItem uniqueOptionId={item} />
						) : (
							<ExRPairedOptionRow
								baseName={item.baseName}
								minData={item.minData}
								maxData={item.maxData}
							/>
						)}
					</div>
				);
			})}
		</OptionEditorOptionRowGroupLayout>
	);
}
