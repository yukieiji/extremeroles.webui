import { groupOptionPairs } from "../logics/optionUtils";
import { ExROptionItem } from "./ExROptionItem";
import { ExRPairedOptionRow } from "./ExRPairedOptionRow";

const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryOptionListProps {
	categoryId: number;
	uniqueOptionIds: number[];
}

/**
 * カテゴリ内のオプション一覧を表示する共通コンポーネント
 */
export function ExRCategoryOptionList({
	categoryId,
	uniqueOptionIds,
}: ExRCategoryOptionListProps) {
	const shouldGroup = GROUPED_CATEGORY_IDS.includes(categoryId);
	const groupedItems = shouldGroup
		? groupOptionPairs(uniqueOptionIds)
		: uniqueOptionIds;

	// gropedItemsはOptionIdの配列か、ペアオプションの情報を持つオブジェクトの配列になる
	return (
		<div
			data-testid="exr-category-list-container"
			className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
		>
			{groupedItems.map((item) => {
				if (typeof item === "number") {
					return <ExROptionItem key={item} uniqueOptionId={item} />;
				}

				return (
					<ExRPairedOptionRow
						key={`pair-${item.baseName}`}
						baseName={item.baseName}
						minData={item.minData}
						maxData={item.maxData}
					/>
				);
			})}
		</div>
	);
}
