import { ExROptionControl } from "../../feature/exr/ExROptionControl";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
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
		<div
			id={`exr-option-${uniqueOptionId}`}
			className={isHighlighted ? "bg-blue-600/30 rounded" : ""}
		>
			<OptionRowContent name={optionData.translatedName}>
				<ExROptionControl
					uniqueOptionId={uniqueOptionId}
					format={optionData.format}
					type={optionData.type}
				/>
			</OptionRowContent>
		</div>
	);
}
