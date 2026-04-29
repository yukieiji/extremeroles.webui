import { useMemo } from "react";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { ExRViewerOptionRow } from "./ExRViewerOptionRow";

interface ExRGeneralCategoryProps {
	categoryId: number;
}

/**
 * ExR一般カテゴリコンポーネント
 */
export function ExRGeneralCategory({ categoryId }: ExRGeneralCategoryProps) {
	const categoryMeta = exrOptionMetaData.categories[categoryId];
	const topLevelOptionIds =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] || [];

	const filteredOptionIds = useMemo(() => {
		if (categoryId !== 0) {
			return topLevelOptionIds;
		}
		return topLevelOptionIds.filter((id) => id !== PRESET_OPTION_UNIQUE_ID);
	}, [categoryId, topLevelOptionIds]);

	const openedExRCategoryIds = useStore((state) => {
		return state.openedExRCategoryIds;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	if (!categoryMeta) {
		return null;
	}

	return (
		<div data-testid={`right-panel-exr-category-${categoryId}`}>
			<CompactAccordion
				title={<span className="text-base">{categoryMeta.name}</span>}
				isOpen={openedExRCategoryIds[categoryId] ?? true}
				onToggle={() => {
					toggleExRCategory(categoryId);
				}}
			>
				<div className="flex flex-col gap-0.5">
					{filteredOptionIds.map((uniqueOptionId) => (
						<ExRViewerOptionRow
							key={uniqueOptionId}
							uniqueOptionId={uniqueOptionId}
							categoryId={categoryId}
						/>
					))}
				</div>
			</CompactAccordion>
		</div>
	);
}
