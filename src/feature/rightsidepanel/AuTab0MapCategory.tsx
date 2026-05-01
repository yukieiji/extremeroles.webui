import { useAuNavigation } from "../../hooks/useAuNavigation";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";

interface AuTab0MapCategoryProps {
	categoryId: number;
}

/**
 * Map用カテゴリコンポーネント (最初の項目がヘッダーに統合される)
 */
export function AuTab0MapCategory({ categoryId }: AuTab0MapCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const mapOptionId = categoryMeta?.options[0] ?? 0;
	const mapOptionMeta = auOptionMetaData.options[mapOptionId];
	const mapSelection = useStore((state) => state.auValue[mapOptionId] ?? 0);

	const { navigateToOption } = useAuNavigation();

	if (!categoryMeta) {
		return null;
	}

	if (!mapOptionMeta) {
		return null;
	}

	const mapValue = mapOptionMeta.range[mapSelection];

	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden">
			<button
				type="button"
				onDoubleClick={() => {
					navigateToOption(0, categoryId, mapOptionId);
				}}
				className="w-full flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 transition-colors"
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
		</div>
	);
}
