import { groupOptionPairs } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { ExROptionItem } from "./ExROptionItem";
import { ExRPairedOptionRow } from "./ExRPairedOptionRow";

const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryOptionListProps {
	categoryId: number;
	options: ExROptionDto[];
}

/**
 * カテゴリ内のオプション一覧を表示する共通コンポーネント
 */
export function ExRCategoryOptionList({
	categoryId,
	options,
}: ExRCategoryOptionListProps) {
	const shouldGroup = GROUPED_CATEGORY_IDS.includes(categoryId);
	const groupedItems = shouldGroup ? groupOptionPairs(options) : options;

	return (
		<div
			data-testid="exr-category-list-container"
			className="flex flex-col gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
		>
			{groupedItems.map((item) => {
				if ("type" in item && item.type === "pair") {
					return (
						<ExRPairedOptionRow
							key={`pair-${item.baseName}`}
							categoryId={categoryId}
							baseName={item.baseName}
							min={item.min}
							max={item.max}
							minLabel={item.minLabel}
							maxLabel={item.maxLabel}
						/>
					);
				}
				return (
					<ExROptionItem
						key={(item as ExROptionDto).Id}
						categoryId={categoryId}
						option={item as ExROptionDto}
					/>
				);
			})}
		</div>
	);
}
