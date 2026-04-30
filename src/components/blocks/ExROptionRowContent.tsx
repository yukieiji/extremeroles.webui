import { ExROptionControl } from "../../feature/exr/ExROptionControl";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { HighlightWrapper } from "../parts/HighlightWrapper";
import { OptionRowContent } from "./OptionContent";

interface ExROptionRowContentProps {
	uniqueOptionId: UniqueOptionId;
}

export function ExROptionRowContent({
	uniqueOptionId,
}: ExROptionRowContentProps) {
	const optionData = exrOptionMetaData.options[uniqueOptionId]?.metaData;
	const isHighlighted = useStore(
		(state) => state.highlightedExROptionId === uniqueOptionId,
	);
	if (!optionData) {
		return null;
	}
	return (
		<HighlightWrapper
			id={`exr-option-${uniqueOptionId}`}
			isHighlighted={isHighlighted}
			isInset={true}
		>
			<OptionRowContent name={optionData.translatedName}>
				<ExROptionControl
					uniqueOptionId={uniqueOptionId}
					format={optionData.format}
					type={optionData.type}
				/>
			</OptionRowContent>
		</HighlightWrapper>
	);
}
