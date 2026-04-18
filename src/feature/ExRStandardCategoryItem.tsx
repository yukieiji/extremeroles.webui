import { Accordion } from "../components/parts/Accordion";
import { ColoredText } from "../components/parts/ColoredText";
import { exrOptionMetaData } from "../logics/api";
import { isPresetOption } from "../logics/optionUtils";
import { useStore } from "../useStore";
import { ExRCategoryOptionList } from "./ExRCategoryOptionList";

interface ExRStandardCategoryItemProps {
	categoryId: number;
}

/**
 * 全般タブなどで使用される標準的なカテゴリ表示コンポーネント
 */
export function ExRStandardCategoryItem({
	categoryId,
}: ExRStandardCategoryItemProps) {
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const categoryName = exrOptionMetaData.categoryInfo[categoryId] ?? "";
	const optionIds = exrOptionMetaData.optionIdMap[categoryId] ?? [];

	const filteredOptionIds = optionIds.filter((optionId) => {
		return !isPresetOption(categoryId, optionId);
	});

	if (filteredOptionIds.length === 0) {
		return null;
	}

	return (
		<div data-testid={`exr-category-${categoryId}`}>
			<Accordion
				title={<ColoredText text={categoryName} />}
				isOpen={isOpen}
				onToggle={() => {
					toggleExRCategory(categoryId);
				}}
			>
				<ExRCategoryOptionList
					categoryId={categoryId}
					optionIds={filteredOptionIds}
				/>
			</Accordion>
		</div>
	);
}
