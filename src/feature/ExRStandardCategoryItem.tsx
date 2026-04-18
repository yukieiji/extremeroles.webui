import { useMemo } from "react";
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

	const options = exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
	const filteredOptions = useMemo(() => {
		if (!options) {
			return [];
		}
		return options.filter((optionId) => {
			return !isPresetOption(categoryId, optionId);
		});
	}, [categoryId, options]);

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<div data-testid={`exr-category-${categoryId}`}>
			<Accordion
				title={
					<ColoredText text={exrOptionMetaData.categoryInfo[categoryId]} />
				}
				isOpen={isOpen}
				onToggle={() => {
					toggleExRCategory(categoryId);
				}}
			>
				<ExRCategoryOptionList
					categoryId={categoryId}
					optionIds={filteredOptions}
				/>
			</Accordion>
		</div>
	);
}
