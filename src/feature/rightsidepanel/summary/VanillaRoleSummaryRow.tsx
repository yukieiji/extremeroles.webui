import { useShallow } from "zustand/react/shallow";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";
import { BaseRoleSummaryRow } from "./BaseRoleSummaryRow";

interface VanillaRoleSummaryRowProps {
	categoryId: number;
}

export function VanillaRoleSummaryRow({
	categoryId,
}: VanillaRoleSummaryRowProps) {
	const navigateAu = useAuOptionNavigationInline();
	const roleData = useStore(
		useShallow((state) => {
			const catMeta = auOptionMetaData.categoryMetaData[categoryId];
			if (!catMeta) {
				return null;
			}
			const chanceId = catMeta.options[0] as AuOptionId;
			const maxCountId = catMeta.options[1] as AuOptionId;
			const chanceMeta = auOptionMetaData.options[chanceId];
			const maxCountMeta = auOptionMetaData.options[maxCountId];

			const chance = chanceMeta?.range[state.auValue[chanceId] ?? 0] ?? 0;
			const maxCount = maxCountMeta?.range[state.auValue[maxCountId] ?? 0] ?? 0;

			if (Number(chance) === 0 || Number(maxCount) === 0) {
				return null;
			}

			return {
				name: catMeta.name,
				display: `${maxCount} - ${chance}%`,
				chanceId,
				tabId: catMeta.tabId,
			};
		}),
	);

	if (!roleData) {
		return null;
	}

	return (
		<BaseRoleSummaryRow
			data-testid="vanilla-role-summary"
			name={roleData.name}
			displayValue={roleData.display}
			onDoubleClick={() =>
				navigateAu(roleData.tabId, categoryId, roleData.chanceId)
			}
		/>
	);
}
