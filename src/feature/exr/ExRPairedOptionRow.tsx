import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import type { OptionData } from "@/type";
import { useStore } from "@/useStore";
import { ExRPairedOptionContent } from "./ExRPairedOptionContent";

interface ExRPairedOptionRowProps {
	baseName: string;
	minData: OptionData;
	maxData: OptionData;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionRow({
	baseName,
	minData,
	maxData,
}: ExRPairedOptionRowProps) {
	const minUniqueOptionId = minData.uniqueOptionId;
	const maxUniqueOptionId = maxData.uniqueOptionId;

	const isHighlighted = useStore((state) => {
		return (
			state.highlightedExROptionId === minUniqueOptionId ||
			state.highlightedExROptionId === maxUniqueOptionId
		);
	});

	const navigateId = createExRNavigateId(minUniqueOptionId);

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
					<ExRPairedOptionContent
						baseName={baseName}
						minData={minData}
						maxData={maxData}
					/>
				}
			/>
		</HighlightWrapper>
	);
}
