import { CompactAccordion } from "../../components/blocks/CompactAccordion";
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
	const auValue = useStore((state) => state.auValue);
	const tabCategoryIds = auOptionMetaData.tabCategoryMap[tabId] || [];

	const activeRoleCategoryIds = tabCategoryIds.filter((categoryId) => {
		const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
		if (!categoryMeta) return false;

		const chanceOptionId = categoryMeta.options[0];
		const maxCountOptionId = categoryMeta.options[1];

		const chanceMeta = auOptionMetaData.options[chanceOptionId];
		const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

		if (!chanceMeta || !maxCountMeta) return false;

		const chanceValue = chanceMeta.range[auValue[chanceOptionId] ?? 0];
		const maxCountValue = maxCountMeta.range[auValue[maxCountOptionId] ?? 0];

		// スポーンレートが0%より大きく、かつスポーン数が0より大きいもの
		return Number(chanceValue) > 0 && Number(maxCountValue) > 0;
	});

	if (activeRoleCategoryIds.length === 0) {
		return null;
	}

	return (
		<CompactAccordion title={title} isOpen={isOpen} onToggle={onToggle}>
			<div className="flex flex-col gap-0.5">
				{activeRoleCategoryIds.map((categoryId) => (
					<AuRoleViewerRow
						key={categoryId}
						tabId={tabId}
						categoryId={categoryId}
					/>
				))}
			</div>
		</CompactAccordion>
	);
}
