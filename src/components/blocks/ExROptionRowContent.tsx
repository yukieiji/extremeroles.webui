import { HighlightWrapper } from "../parts/HighlightWrapper";
import { ExROptionControl } from "../../feature/exr/ExROptionControl";
import { exrOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import type { UniqueOptionId } from "../../type";
import { OptionItem } from "../parts/OptionItem";
import { OptionNameDisplay } from "../parts/OptionNameDisplay";

interface ExROptionRowContentProps {
	uniqueOptionId: UniqueOptionId;
}

export function ExROptionRowContent({
	uniqueOptionId,
}: ExROptionRowContentProps) {
	const optionData = exrOptionMetaData.options[uniqueOptionId]?.metaData;
	const highlightedExROptionId = useStore(
		(state) => state.highlightedExROptionId,
	);
	const isHighlighted = highlightedExROptionId === uniqueOptionId;

	if (!optionData) {
		return null;
	}
	return (
		<HighlightWrapper isHighlighted={isHighlighted}>
			<OptionItem className="min-h-12">
				<div className="flex-1 min-w-0">
					<span className="text-sm font-medium text-gray-200 wrap-break-words">
						<OptionNameDisplay name={optionData.translatedName} />
					</span>
				</div>
				<div className="shrink-0 flex items-center gap-2">
					<ExROptionControl
						uniqueOptionId={uniqueOptionId}
						format={optionData.format}
						type={optionData.type}
					/>
				</div>
			</OptionItem>
		</HighlightWrapper>
	);
}
