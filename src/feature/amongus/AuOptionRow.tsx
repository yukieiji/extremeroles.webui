import { OptionRowContent } from "../../components/blocks/OptionContent";
import { HighlightWrapper } from "../../components/parts/HighlightWrapper";
import { LargePoint } from "../../components/parts/LargePoint";
import { OptionRowContainer } from "../../components/parts/OptionRowContainer";
import { createAuNavigateId } from "../../hooks/useOptionNavigation";
import { auOptionMetaData } from "../../logics/api";
import { useUpdateAuOptionSelection } from "../../logics/api.store";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";
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
				content={
					<OptionRowContent name={optionMeta.title}>
						<AuOptionControl
							optionMeta={optionMeta}
							selection={selection}
							onSelectionChange={(selection) => {
								updateAuOption({ auOptionId, selection });
							}}
						/>
					</OptionRowContent>
				}
			/>
		</HighlightWrapper>
	);
}
