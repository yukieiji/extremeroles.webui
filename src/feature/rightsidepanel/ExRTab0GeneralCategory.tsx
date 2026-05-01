import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { RightPanelContainer } from "../../components/blocks/RightPanelContainer";
import { ColoredText } from "../../components/parts/ColoredText";
import { exrOptionMetaData } from "../../logics/api";
import { filterVisibleTopLevelOptionIds } from "../../logics/exrOptionUtils";
import { useStore } from "../../useStore";
import { ExRTab0OptionRow } from "./ExRTab0OptionRow";

interface ExRTab0GeneralCategoryProps {
	categoryId: number;
}

/**
 * ExR一般カテゴリコンポーネント
 */
export function ExRTab0GeneralCategory({
	categoryId,
}: ExRTab0GeneralCategoryProps) {
	const categoryMeta = exrOptionMetaData.categories[categoryId];
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const uniqueOptions =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
	if (!categoryMeta || !uniqueOptions) {
		return null;
	}

	const filteredOptions = filterVisibleTopLevelOptionIds(
		categoryId,
		uniqueOptions,
	);

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<CompactAccordion
			title={
				<span className="text-base">
					<ColoredText text={categoryMeta.name} />
				</span>
			}
			isOpen={isOpen}
			onToggle={() => {
				toggleExRCategory(categoryId);
			}}
		>
			<RightPanelContainer arr={filteredOptions}>
				{(uniqueOptionId) => (
					<ExRTab0OptionRow uniqueOptionId={uniqueOptionId} />
				)}
			</RightPanelContainer>
		</CompactAccordion>
	);
}
