import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuTab0OptionRow } from "./AuTab0OptionRow";

/**
 * 一般カテゴリコンポーネント
 */
export function AuTab0GeneralCategory({ categoryId }: { categoryId: number }) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const openedAuTab0CategoryIds = useStore(
		(state) => state.openedAuTab0CategoryIds,
	);
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

	if (!categoryMeta) return null;

	return (
		<CompactAccordion
			title={<span className="text-sm">{categoryMeta.name}</span>}
			isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
			onToggle={() => toggleAuTab0Category(categoryId)}
		>
			<div className="flex flex-col gap-0.5">
				{categoryMeta.options.map((optionId) => (
					<AuTab0OptionRow
						key={optionId}
						optionId={optionId}
						categoryId={categoryId}
					/>
				))}
			</div>
		</CompactAccordion>
	);
}
