import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { exrOptionMetaData } from "../../logics/api";
import { getUniqueOptionId } from "../../logics/optionUtils";
import {
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
	type TabId,
} from "../../type";
import { useStore } from "../../useStore";
import { ExRRoleViewerRow } from "./ExRRoleViewerRow";

interface ExRRoleViewerSectionProps {
	tabId: TabId;
	title: string;
	isOpen: boolean;
	onToggle: () => void;
}

/**
 * ExRの役職設定のセクションコンポーネント
 */
export function ExRRoleViewerSection({
	tabId,
	title,
	isOpen,
	onToggle,
}: ExRRoleViewerSectionProps) {
	const exrValue = useStore((state) => state.exrValue);
	const tabMetaData = exrOptionMetaData.tabs[tabId];
	const tabCategoryIds = tabMetaData?.categoryIds || [];

	const activeRoleCategoryIds = tabCategoryIds.filter((categoryId: number) => {
		const uniqueRateId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_RATE_OPTION_ID,
		);
		const uniqueCountId = getUniqueOptionId(
			tabId,
			categoryId,
			SPAWN_COUNT_OPTION_ID,
		);

		const rateData = exrValue[uniqueRateId];
		const countData = exrValue[uniqueCountId];

		if (!rateData || !countData) {
			return false;
		}

		const rateValue = rateData.values[rateData.selection];
		const countValue = countData.values[countData.selection];

		// スポーンレートが0%より大きく、かつスポーン数が0より大きいもの
		return Number(rateValue) > 0 && Number(countValue) > 0;
	});

	if (activeRoleCategoryIds.length === 0) {
		return null;
	}

	return (
		<CompactAccordion title={title} isOpen={isOpen} onToggle={onToggle}>
			<div className="flex flex-col gap-0.5">
				{activeRoleCategoryIds.map((categoryId: number) => (
					<ExRRoleViewerRow
						key={categoryId}
						tabId={tabId}
						categoryId={categoryId}
					/>
				))}
			</div>
		</CompactAccordion>
	);
}
