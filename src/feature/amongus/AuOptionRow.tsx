import { DisabledControlTooltip } from "@/components/blocks/DisabledControlTooltip";
import { OptionRowContent } from "@/components/blocks/OptionContent";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import { TYPOGRAPHY } from "@/designConstants";
import { createAuNavigateId } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import { useUpdateAuOptionSelection } from "@/logics/api.store";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";
import { AuOptionControl } from "./AuOptionControl";

interface AuOptionRowProps {
	auOptionId: AuOptionId;
}

/**
 * Auの各オプション行を表示するコンポーネント
 */
export function AuOptionRow({ auOptionId }: AuOptionRowProps) {
	const optionMeta = auOptionMetaData.options[auOptionId];
	const selection = useStore((state) => state.auValue[auOptionId] ?? 0);
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);

	const inactiveOptionDisplay = useStore(
		(state) => state.appSetting?.inactiveOptionDisplay ?? "hidden",
	);

	// Category ID and Chance option check
	const categoryId = optionMeta?.categoryId;
	const categoryMeta =
		categoryId != null
			? auOptionMetaData.categoryMetaData[categoryId]
			: undefined;
	const chanceOptionId = categoryMeta?.options[0];
	const chanceValueIndex = useStore((state) =>
		chanceOptionId != null ? (state.auValue[chanceOptionId] ?? 0) : 0,
	);
	const chanceOptionMeta =
		chanceOptionId != null
			? auOptionMetaData.options[chanceOptionId]
			: undefined;
	const chanceActualValue = chanceOptionMeta?.range?.[chanceValueIndex] ?? 0;
	const isRoleInactive = chanceOptionId != null && chanceActualValue === 0;

	const isDisabled = inactiveOptionDisplay === "disabled" && isRoleInactive;

	const updateAuOption = useUpdateAuOptionSelection();

	if (!optionMeta) {
		return null;
	}

	const isHighlighted = highlightedAuOptionId === auOptionId;
	const navigateId = createAuNavigateId(auOptionId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={true}
		>
			<OptionRowContainer
				leading={<LargePoint />}
				depth={0}
				indentMultiplier={1}
				content={
					<div className={TYPOGRAPHY.LABEL}>
						<OptionRowContent name={optionMeta.title}>
							<DisabledControlTooltip disabled={isDisabled}>
								<AuOptionControl
									optionMeta={optionMeta}
									selection={selection}
									onSelectionChange={(selection) => {
										updateAuOption({ auOptionId, selection });
									}}
									disabled={isDisabled}
								/>
							</DisabledControlTooltip>
						</OptionRowContent>
					</div>
				}
			/>
		</HighlightWrapper>
	);
}
