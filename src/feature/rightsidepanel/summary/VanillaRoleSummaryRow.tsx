import { useShallow } from "zustand/react/shallow";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { TYPOGRAPHY } from "@/designConstants";
import { useAuOptionNavigationInline } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

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
		<ViewerOptionRow
			data-testid="vanilla-role-summary"
			title={
				<ColoredText text={roleData.name} className={TYPOGRAPHY.CHILD_LABEL} />
			}
			value={roleData.display}
			onDoubleClick={() =>
				navigateAu(roleData.tabId, categoryId, roleData.chanceId)
			}
		/>
	);
}
