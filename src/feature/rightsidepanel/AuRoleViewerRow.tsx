import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useAuNavigation } from "../../hooks/useAuNavigation";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";

interface AuRoleViewerRowProps {
	tabId: number;
	categoryId: number;
}

/**
 * 役職の概要を表示する行コンポーネント
 * 役職名、スポーンレート、スポーン数を表示する
 */
export function AuRoleViewerRow({ tabId, categoryId }: AuRoleViewerRowProps) {
	const { navigateToOption } = useAuNavigation();

	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];

	// 役職タブ（1, 2）では、0番目がChance、1番目がMaxCount
	const chanceOptionId = categoryMeta?.options[0];
	const maxCountOptionId = categoryMeta?.options[1];

	const chanceSelection = useStore((state) =>
		chanceOptionId ? state.auValue[chanceOptionId] : undefined,
	);
	const maxCountSelection = useStore((state) =>
		maxCountOptionId ? state.auValue[maxCountOptionId] : undefined,
	);

	if (!categoryMeta || !chanceOptionId || !maxCountOptionId) {
		return null;
	}

	const chanceMeta = auOptionMetaData.options[chanceOptionId];
	const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

	if (!chanceMeta || !maxCountMeta) {
		return null;
	}

	const chanceValue = chanceMeta.range[chanceSelection ?? 0];
	const maxCountValue = maxCountMeta.range[maxCountSelection ?? 0];

	if (chanceValue === undefined || maxCountValue === undefined) {
		return null;
	}

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={categoryMeta.name}
				value={
					<div className="flex items-center gap-2">
						<span className="text-blue-400">{chanceValue.toString()}%</span>
						<span className="text-gray-500">/</span>
						<span className="text-blue-400">{maxCountValue.toString()}</span>
					</div>
				}
				onDoubleClick={() => {
					navigateToOption(tabId, categoryId, chanceOptionId);
				}}
			/>
		</div>
	);
}
