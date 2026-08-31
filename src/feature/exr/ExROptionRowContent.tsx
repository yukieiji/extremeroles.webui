import { OptionRowContent } from "@/components/blocks/OptionContent";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

	const control = (
		<ExROptionControl
			uniqueOptionId={uniqueOptionId}
			format={optionData.format}
			type={optionData.type}
			disabled={isDisabled}
		/>
	);

	return (
		<OptionRowContent name={optionData.translatedName}>
			{isDisabled ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={<span className="inline-block cursor-not-allowed" />}
						>
							{control}
						</TooltipTrigger>
						<TooltipContent>
							前提となるオプションや役職が設定されていません
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				control
			)}
		</OptionRowContent>
	);
}
