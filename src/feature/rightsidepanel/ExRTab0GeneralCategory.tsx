import { useShallow } from "zustand/react/shallow";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { ExRTab0OptionList } from "./ExRTab0OptionRow";

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
	const openedExrTab0CategoryIds = useStore((state) => {
		return state.openedExrTab0CategoryIds;
	});
	const toggleExrTab0Category = useStore((state) => {
		return state.toggleExrTab0Category;
	});

	const uniqueOptions =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];

	const isVisible = useStore(
		useShallow((state) => {
			if (!uniqueOptions) {
				return false;
			}
			const filteredUniqueOptions =
				categoryId === 0
					? uniqueOptions.filter((optionId) => {
							return optionId !== PRESET_OPTION_UNIQUE_ID;
						})
					: uniqueOptions;
			return (
				filteredUniqueOptions.length > 0 &&
				filteredUniqueOptions.some((id) => state.isExROptionActive[id])
			);
		}),
	);

	if (!categoryMeta || !uniqueOptions || !isVisible) {
		return null;
	}

	return (
		<CompactAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={openedExrTab0CategoryIds[categoryId] ?? true}
			onToggle={() => {
				toggleExrTab0Category(categoryId);
			}}
		>
			<ExRTab0OptionList
				categoryId={categoryId}
				uniqueOptionIds={uniqueOptions}
			/>
		</CompactAccordion>
	);
}
