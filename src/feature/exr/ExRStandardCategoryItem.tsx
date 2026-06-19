import { useMemo } from "react";
import { OptionEditorAccordion } from "@/components/blocks/OptionEditorAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { TYPOGRAPHY } from "@/designConstants";
import { createExRCategoryNavigateId } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { useStore } from "@/useStore";
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
	const highlightedExRCategoryId = useStore(
		(state) => state.highlightedExRCategoryId,
	);

	const uniqueOptions =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
	const filteredOptions = useMemo(() => {
		if (!uniqueOptions) {
			return [];
		}
		return uniqueOptions.filter((uniqueId) => {
			return uniqueId !== PRESET_OPTION_UNIQUE_ID;
		});
	}, [uniqueOptions]);

	if (filteredOptions.length === 0) {
		return null;
	}

	const isHighlighted = highlightedExRCategoryId === categoryId;
	const navigateId = createExRCategoryNavigateId(categoryId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<div data-testid={`exr-category-${categoryId}`}>
				<OptionEditorAccordion
					title={
						<ColoredText
							text={exrOptionMetaData.categories[categoryId]?.name ?? ""}
							className={TYPOGRAPHY.CHILD_LABEL}
						/>
					}
					isOpen={isOpen}
					onToggle={() => {
						toggleExRCategory(categoryId);
					}}
				>
					<ExRCategoryOptionList
						categoryId={categoryId}
						uniqueOptionIds={filteredOptions}
					/>
				</OptionEditorAccordion>
			</div>
		</HighlightWrapper>
	);
}
