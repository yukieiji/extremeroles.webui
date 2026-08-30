import { OptionRowContent } from "@/components/blocks/OptionContent";
import { useOptionActive } from "@/hooks/useExROptionData";
import { exrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { ExROptionControl } from "./ExROptionControl";

interface ExROptionRowContentProps {
	uniqueOptionId: UniqueOptionId;
}

export function ExROptionRowContent({
	uniqueOptionId,
}: ExROptionRowContentProps) {
	const isOptionActive = useOptionActive(uniqueOptionId);
	const inactiveOptionDisplay = useStore(
		(state) => state.appSetting?.inactiveOptionDisplay ?? "hidden",
	);
	const isDisabled = inactiveOptionDisplay === "disabled" && !isOptionActive;

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
				disabled={isDisabled}
			/>
		</OptionRowContent>
	);
}
