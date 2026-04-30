import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuTab0OptionRow } from "./AuTab0OptionRow";

interface AuTab0GeneralCategoryProps {
	categoryId: number;
}

/**
 * 一般カテゴリコンポーネント
 */
export function AuTab0GeneralCategory({
	categoryId,
}: AuTab0GeneralCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const openedAuTab0CategoryIds = useStore((state) => {
		return state.openedAuTab0CategoryIds;
	});
	const toggleAuTab0Category = useStore((state) => {
		return state.toggleAuTab0Category;
	});

	if (!categoryMeta) {
		return null;
	}

	return (
		<CompactAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
			onToggle={() => {
				toggleAuTab0Category(categoryId);
			}}
		>
			<div className="flex flex-col gap-0.5">
				{categoryMeta.options.map((optionId) => {
					return (
						<AuTab0OptionRow
							key={optionId}
							optionId={optionId}
							categoryId={categoryId}
						/>
					);
				})}
			</div>
		</CompactAccordion>
	);
}
