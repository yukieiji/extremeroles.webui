import { auOptionMetaData } from "../../../logics/api";
import type { AuOptionId } from "../../../type";
import { useStore } from "../../../useStore";
import { AuOptionRow } from "./AuOptionRow";

interface AuMapCategoryProps {
	categoryId: number;
	onDoubleClick: (categoryId: number, optionId: AuOptionId) => void;
}

export function AuMapCategory({
	categoryId,
	onDoubleClick,
}: AuMapCategoryProps) {
	const auValue = useStore((state) => state.auValue);
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];

	if (!categoryMeta) {
		return null;
	}

	const mapOptionId = categoryMeta.options[0];
	const [_, ...otherOptionIds] = categoryMeta.options;
	const mapOptionMeta = auOptionMetaData.options[mapOptionId];

	if (!mapOptionMeta) {
		return null;
	}

	const mapValue = mapOptionMeta.range[auValue[mapOptionId] ?? 0];

	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-1">
			<button
				type="button"
				data-testid={`right-panel-option-${mapOptionId}`}
				onDoubleClick={() => onDoubleClick(categoryId, mapOptionId)}
				className="w-full flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
			>
				<div className="flex items-center gap-3">
					<div className="w-4 h-4" />
					<span className="font-semibold text-gray-200 text-sm">
						{mapOptionMeta.title}
					</span>
				</div>
				<span className="text-sm text-blue-400 font-medium">
					{mapValue.toString()}
				</span>
			</button>
			{otherOptionIds.length > 0 && (
				<div className="p-1 bg-gray-900 space-y-0.5">
					{otherOptionIds.map((optionId) => (
						<AuOptionRow
							key={optionId}
							optionId={optionId}
							onDoubleClick={(id) => onDoubleClick(categoryId, id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
