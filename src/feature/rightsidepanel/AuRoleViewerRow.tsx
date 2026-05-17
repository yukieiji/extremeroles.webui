import { RightPanelBorderLine } from "@/components/parts/RightPanelBorderLine";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useAuOptionNavigation } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import { useStore } from "@/useStore";

interface AuRoleViewerRowProps {
	tabId: number;
	categoryId: number;
	withBorder?: boolean;
}

/**
 * 役職の概要を表示する行コンポーネント
 * 役職名、スポーンレート、スポーン数を表示する
 */
export function AuRoleViewerRow({
	tabId,
	categoryId,
	withBorder = false,
}: AuRoleViewerRowProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];

	// 役職タブ（1, 2）では、0番目がChance、1番目がMaxCount
	const chanceOptionId = categoryMeta.options[0] ?? 0;
	const maxCountOptionId = categoryMeta.options[1] ?? 0;

	const chanceSelection = useStore(
		(state) => state.auValue[chanceOptionId] ?? 0,
	);
	const maxCountSelection = useStore(
		(state) => state.auValue[maxCountOptionId] ?? 0,
	);
	const navigateToOption = useAuOptionNavigation(
		tabId,
		categoryId,
		chanceOptionId,
	);

	const chanceMeta = auOptionMetaData.options[chanceOptionId];
	const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

	if (!chanceMeta || !maxCountMeta) {
		return null;
	}

	const chanceValue = chanceMeta.range[chanceSelection] ?? 0;
	const maxCountValue = maxCountMeta.range[maxCountSelection] ?? 0;

	return (
		<>
			{withBorder && (
				<RightPanelBorderLine className="first:hidden" depth={0} />
			)}
			<ViewerOptionRow
				title={categoryMeta?.name ?? ""}
				value={
					<div className="flex items-center gap-2">
						<span className="text-blue-400">{chanceValue.toString()}%</span>
						<span className="text-gray-500">/</span>
						<span className="text-blue-400">{maxCountValue.toString()}</span>
					</div>
				}
				onDoubleClick={navigateToOption}
			/>
		</>
	);
}
