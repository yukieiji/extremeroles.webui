import { useAuNavigation } from "../../hooks/useAuNavigation";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuTab0OptionRow } from "./AuTab0OptionRow";

interface AuTab0MapCategoryProps {
	categoryId: number;
}

/**
 * Map用カテゴリコンポーネント (最初の項目がヘッダーに統合される)
 */
export function AuTab0MapCategory({ categoryId }: AuTab0MapCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const auValue = useStore((state) => {
		return state.auValue;
	});
	const { navigateToOption } = useAuNavigation();

	if (!categoryMeta) {
		return null;
	}

	const mapOptionId = categoryMeta.options[0];
	const otherOptionIds = categoryMeta.options.slice(1);
	const mapOptionMeta = auOptionMetaData.options[mapOptionId];

	if (!mapOptionMeta) {
		return null;
	}

	const mapValue = mapOptionMeta.range[auValue[mapOptionId] ?? 0];

	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden">
			<button
				type="button"
				onDoubleClick={() => {
					navigateToOption(0, categoryId, mapOptionId);
				}}
				className="w-full flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
			>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4" />
					<span className="font-semibold text-gray-200 text-base">
						{mapOptionMeta.title}
					</span>
				</div>
				<span className="text-sm text-blue-400 font-medium px-2">
					{mapValue.toString()}
				</span>
			</button>
			{otherOptionIds.length > 0 && (
				<div className="p-1 bg-gray-900 space-y-0.5">
					{otherOptionIds.map((optionId) => {
						return (
							<AuTab0OptionRow
								key={optionId}
								optionId={optionId}
								categoryId={categoryId}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
