import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { exrOptionMetaData } from "../../logics/api";
import { groupOptionPairs } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import {
	ExRViewerMinMaxRow,
	ExRViewerOptionRow,
} from "./ExRViewerOptionRow";

interface ExRViewerCategoryProps {
	categoryId: number;
}

/**
 * ExRのカテゴリコンポーネント（右パネル用）
 */
export function ExRViewerCategory({ categoryId }: ExRViewerCategoryProps) {
	const categoryMeta = exrOptionMetaData.categories[categoryId];
	const openedExRCategoryIds = useStore((state) => state.openedExRCategoryIds);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);
	const isExROptionActive = useStore((state) => state.isExROptionActive);

	if (!categoryMeta) {
		return null;
	}

	const allOptionIds =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] || [];
	const activeOptionIds = allOptionIds.filter((id) => isExROptionActive[id]);

	if (activeOptionIds.length === 0) {
		return null;
	}

	const groupedOptions = groupOptionPairs(activeOptionIds);

	return (
		<CompactAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={openedExRCategoryIds[categoryId] ?? true}
			onToggle={() => {
				toggleExRCategory(categoryId);
			}}
		>
			<div className="flex flex-col gap-0.5">
				{groupedOptions.map((item, idx) => {
					if (typeof item === "number") {
						return <ExRViewerOptionRow key={item} uniqueOptionId={item} />;
					}
					return (
						<ExRViewerMinMaxRow
							key={item.minData.uniqueOptionId}
							baseName={item.baseName}
							minUniqueId={item.minData.uniqueOptionId}
							maxUniqueId={item.maxData.uniqueOptionId}
						/>
					);
				})}
			</div>
		</CompactAccordion>
	);
}
