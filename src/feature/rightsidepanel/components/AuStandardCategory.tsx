import { Accordion } from "../../../components/parts/Accordion";
import { auOptionMetaData } from "../../../logics/api";
import type { AuOptionId } from "../../../type";
import { useStore } from "../../../useStore";
import { AuOptionRow } from "./AuOptionRow";

interface AuStandardCategoryProps {
	categoryId: number;
	onDoubleClick: (categoryId: number, optionId: AuOptionId) => void;
}

export function AuStandardCategory({
	categoryId,
	onDoubleClick,
}: AuStandardCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const openedAuTab0CategoryIds = useStore(
		(state) => state.openedAuTab0CategoryIds,
	);
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

	if (!categoryMeta) {
		return null;
	}

	return (
		<Accordion
			title={categoryMeta.name}
			isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
			onToggle={() => toggleAuTab0Category(categoryId)}
			className="border border-gray-700 rounded-lg overflow-hidden mb-1"
			headerClassName="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
			titleClassName="font-semibold text-gray-200 text-sm"
			contentClassName="p-1 bg-gray-900 border-t border-gray-700"
		>
			<div className="flex flex-col gap-0.5">
				{categoryMeta.options.map((optionId) => (
					<AuOptionRow
						key={optionId}
						optionId={optionId}
						onDoubleClick={(id) => onDoubleClick(categoryId, id)}
					/>
				))}
			</div>
		</Accordion>
	);
}
