import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExrNavigation } from "../../hooks/useExrNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { getUniqueOptionId } from "../../logics/optionUtils";
import {
	type OptionTab,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "../../type";
import { useStore } from "../../useStore";

interface ExRRoleViewerRowProps {
	tabId: OptionTab;
	categoryId: number;
}

/**
 * ExRの役職の概要を表示する行コンポーネント
 */
export function ExRRoleViewerRow({ tabId, categoryId }: ExRRoleViewerRowProps) {
	const exrValue = useStore((state) => state.exrValue);
	const { navigateToOption } = useExrNavigation();

	const categoryMeta = exrOptionMetaData.categories[categoryId];
	if (!categoryMeta) {
		return null;
	}

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
		return null;
	}

	const rateValue = rateData.values[rateData.selection];
	const countValue = countData.values[countData.selection];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={categoryMeta.name}
				value={
					<div className="flex items-center gap-2">
						<span className="text-blue-400">{rateValue.toString()}%</span>
						<span className="text-gray-500">/</span>
						<span className="text-blue-400">{countValue.toString()}</span>
					</div>
				}
				onDoubleClick={() => {
					navigateToOption(tabId, categoryId, uniqueRateId);
				}}
				testId={`right-panel-exr-role-${categoryId}`}
			/>
		</div>
	);
}
