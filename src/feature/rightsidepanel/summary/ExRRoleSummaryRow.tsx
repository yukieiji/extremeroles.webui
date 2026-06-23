import { useShallow } from "zustand/react/shallow";
import { useExRCategoryNavigationInline } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "@/type";
import { useStore } from "@/useStore";
import { BaseRoleSummaryRow } from "../../../components/blocks/BaseRoleSummaryRow";

interface ExRRoleSummaryRowProps {
	categoryId: number;
}

export function ExRRoleSummaryRow({ categoryId }: ExRRoleSummaryRowProps) {
	const navigateExRCategory = useExRCategoryNavigationInline();
	const roleData = useStore(
		useShallow((state) => {
			const catMeta = exrOptionMetaData.categories[categoryId];
			if (!catMeta) {
				return null;
			}

			const chanceId = getUniqueOptionId(
				catMeta.tabId,
				categoryId,
				SPAWN_RATE_OPTION_ID,
			);
			const maxCountId = getUniqueOptionId(
				catMeta.tabId,
				categoryId,
				SPAWN_COUNT_OPTION_ID,
			);

			const chanceValueData = state.exrValue[chanceId];
			const maxCountValueData = state.exrValue[maxCountId];

			if (!chanceValueData || !maxCountValueData) {
				return null;
			}

			const chance = chanceValueData.values[chanceValueData.selection] ?? 0;
			const maxCount =
				maxCountValueData.values[maxCountValueData.selection] ?? 0;

			if (Number(chance) === 0 || Number(maxCount) === 0) {
				return null;
			}

			return {
				name: catMeta.name,
				display: `${maxCount} - ${chance}`,
				chanceId,
			};
		}),
	);

	if (!roleData) {
		return null;
	}

	const catMeta = exrOptionMetaData.categories[categoryId];

	return (
		<BaseRoleSummaryRow
			data-testid="exr-role-summary"
			name={roleData.name}
			displayValue={roleData.display}
			onDoubleClick={() =>
				catMeta && navigateExRCategory(catMeta.tabId, categoryId)
			}
		/>
	);
}
