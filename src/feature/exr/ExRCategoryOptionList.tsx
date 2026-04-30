import { BorderLine } from "../../components/parts/BorderLine";
import { LargePoint } from "../../components/parts/LargePoint";
import { OptionRowContainer } from "../../components/parts/OptionRowContainer";
import { groupOptionPairs } from "../../logics/optionUtils";
import type { UniqueOptionId } from "../../type";
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
	const groupedItems = shouldGroup
		? groupOptionPairs(uniqueOptionIds)
		: uniqueOptionIds;

	// gropedItemsはOptionIdの配列か、ペアオプションの情報を持つオブジェクトの配列になる
	return (
		<div data-testid="exr-category-list-container" className="flex flex-col">
			{groupedItems.map((item, index) => {
				if (typeof item === "number") {
					return (
						<>
							{index !== 0 && <BorderLine />}
							<ExROptionItem key={item} uniqueOptionId={item} />
						</>
					);
				}

				return (
					<>
						{index !== 0 && <BorderLine />}
						<OptionRowContainer
							key={`pair-${item.baseName}`}
							leading={<LargePoint />}
							content={
								<ExRPairedOptionItem
									baseName={item.baseName}
									minData={item.minData}
									maxData={item.maxData}
								/>
							}
						/>
					</>
				);
			})}
		</div>
	);
}
