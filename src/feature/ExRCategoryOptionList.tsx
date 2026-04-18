import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId, groupOptionPairs } from "../logics/optionUtils";
import { useStore } from "../useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExRPairedOptionRow } from "./ExRPairedOptionRow";

const GROUPED_CATEGORY_IDS = [5, 6];

interface ExRCategoryOptionListProps {
	categoryId: number;
	optionIds: number[];
}

/**
 * カテゴリ内のオプション一覧を表示する共通コンポーネント
 */
export function ExRCategoryOptionList({
	categoryId,
	optionIds,
}: ExRCategoryOptionListProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const valueDataRecord = useStore((state) => {
		return state.valueData;
	});
	const isOptionActiveRecord = useStore((state) => {
		return state.isOptionActive;
	});

	const options = optionIds.map((id) => {
		const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, id);
		const meta = exrOptionMetaData.optionMetaData[uniqueId];
		const valueData = valueDataRecord[uniqueId];
		const isOptionActive = isOptionActiveRecord[uniqueId];

		return {
			Id: id,
			TranslatedName: meta?.translatedName ?? "",
			Format: meta?.format ?? "",
			IsActive: isOptionActive ?? false,
			Selection: valueData?.selection ?? 0,
			RangeMeta: {
				Type: meta?.type ?? "Single",
				Values: valueData?.values ?? [],
			},
			Childs: [], // We don't need real Childs here for grouping
		} as any;
	});

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
							minOptionId={item.min.Id}
							maxOptionId={item.max.Id}
							minLabel={item.minLabel}
							maxLabel={item.maxLabel}
						/>
					);
				}
				return (
					<ExROptionItem
						key={item.Id}
						categoryId={categoryId}
						optionId={item.Id}
					/>
				);
			})}
		</div>
	);
}
