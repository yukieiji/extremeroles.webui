import { useMemo } from "react";
import { OptionEditorAccordion } from "@/components/blocks/OptionEditorAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
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
	const defaultCategoryOpen = useStore(
		(state) => state.appSettings.defaultCategoryOpen,
	);
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? defaultCategoryOpen;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

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

	return (
		<div data-testid={`exr-category-${categoryId}`}>
			<OptionEditorAccordion
				title={
					<ColoredText
						text={exrOptionMetaData.categories[categoryId]?.name ?? ""}
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
	);
}
