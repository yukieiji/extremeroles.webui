import { useShallow } from "zustand/react/shallow";
import { RightPanelContainer } from "../../components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "../../components/blocks/ViewerGroupAccordion";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuRoleViewerRow } from "./AuRoleViewerRow";

interface AuRoleViewerSectionProps {
	tabId: number;
	title: string;
	isOpen: boolean;
	onToggle: () => void;
}

/**
 * 役職設定のセクションコンポーネント
 * スポーン設定（レート > 0 かつ 数 > 0）が有効な役職のみを表示する
 */
export function AuRoleViewerSection({
	tabId,
	title,
	isOpen,
	onToggle,
}: AuRoleViewerSectionProps) {
	const tabCategoryIds = auOptionMetaData.tabCategoryMap[tabId];

	const activeRoleCategoryIds = useStore(
		useShallow((state) =>
			tabCategoryIds
				? tabCategoryIds.filter((categoryId) => {
						const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
						if (!categoryMeta) {
							return false;
						}

						const chanceOptionId = categoryMeta.options[0];
						const maxCountOptionId = categoryMeta.options[1];

						const chanceMeta = auOptionMetaData.options[chanceOptionId];
						const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

						if (!chanceMeta || !maxCountMeta) {
							return false;
						}

						const chanceValue =
							chanceMeta.range[state.auValue[chanceOptionId] ?? 0];
						const maxCountValue =
							maxCountMeta.range[state.auValue[maxCountOptionId] ?? 0];

						if (chanceValue === undefined || maxCountValue === undefined) {
							return false;
						}
						// スポーンレートが0%より大きく、かつスポーン数が0より大きいもの
						return Number(chanceValue) > 0 && Number(maxCountValue) > 0;
					})
				: [],
		),
	);

	if (activeRoleCategoryIds.length === 0) {
		return null;
	}

	return (
		<ViewerGroupAccordion title={title} isOpen={isOpen} onToggle={onToggle}>
			<RightPanelContainer arr={activeRoleCategoryIds}>
				{(categoryId) => (
					<AuRoleViewerRow tabId={tabId} categoryId={categoryId} />
				)}
			</RightPanelContainer>
		</ViewerGroupAccordion>
	);
}
