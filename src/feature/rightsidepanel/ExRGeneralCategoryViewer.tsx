import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { AuTab0OptionValue } from "./AuTab0OptionValue";

interface ExRGeneralCategoryViewerProps {
	categoryId: number;
}

/**
 * ExR一般カテゴリ表示コンポーネント
 */
export function ExRGeneralCategoryViewer({
	categoryId,
}: ExRGeneralCategoryViewerProps) {
	const categoryMeta = exrOptionMetaData.categories[categoryId];
	const exrValue = useStore((state) => state.exrValue);
	const isExROptionActive = useStore((state) => state.isExROptionActive);
	const openedExrGeneralCategoryIds = useStore(
		(state) => state.openedExrGeneralCategoryIds,
	);
	const toggleExrGeneralCategory = useStore(
		(state) => state.toggleExrGeneralCategory,
	);
	const { navigateToExROption } = useExRNavigation();

	if (!categoryMeta) {
		return null;
	}

	const topLevelOptions =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId] || [];

	const visibleOptions = topLevelOptions.filter(
		(id) => isExROptionActive[id] && id !== PRESET_OPTION_UNIQUE_ID,
	);

	if (visibleOptions.length === 0) {
		return null;
	}

	return (
		<CompactAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={openedExrGeneralCategoryIds[categoryId] ?? true}
			onToggle={() => {
				toggleExrGeneralCategory(categoryId);
			}}
		>
			<div className="flex flex-col gap-0.5">
				{visibleOptions.map((uniqueId) => {
					const option = exrOptionMetaData.options[uniqueId];
					const valueData = exrValue[uniqueId];
					if (!option || !valueData) {
						return null;
					}

					const value = valueData.values[valueData.selection];

					return (
						<div key={uniqueId} className="border-white border-b">
							<ViewerOptionRow
								title={option.metaData.translatedName}
								value={
									<AuTab0OptionValue
										value={value}
										format={option.metaData.format}
									/>
								}
								onDoubleClick={() => {
									navigateToExROption(0, categoryId, uniqueId);
								}}
								testId={`right-panel-exr-option-${uniqueId}`}
							/>
						</div>
					);
				})}
			</div>
		</CompactAccordion>
	);
}
