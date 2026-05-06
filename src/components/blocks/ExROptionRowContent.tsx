import { ExROptionControl } from "@/feature/exr/ExROptionControl";
import { exrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";
import { OptionRowContent } from "./OptionContent";

interface ExROptionRowContentProps {
	uniqueOptionId: UniqueOptionId;
}

export function ExROptionRowContent({
	uniqueOptionId,
}: ExROptionRowContentProps) {
	const optionData = exrOptionMetaData.options[uniqueOptionId]?.metaData;
	if (!optionData) {
		return null;
	}
	return (
		<OptionRowContent name={optionData.translatedName}>
			<ExROptionControl
				uniqueOptionId={uniqueOptionId}
				format={optionData.format}
				type={optionData.type}
			/>
		</OptionRowContent>
	);
}
