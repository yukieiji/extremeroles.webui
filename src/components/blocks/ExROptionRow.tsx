import { HighlightWrapper } from "../../components/parts/HighlightWrapper";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { LargePoint } from "../parts/LargePoint";
import { OptionRowContainer } from "../parts/OptionRowContainer";
import { ExROptionRowContent } from "./ExROptionRowContent";

interface ExROptionRowProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	isLeaf?: boolean;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
export function ExROptionRow({
	uniqueOptionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	const highlightedExROptionId = useStore(
		(state) => state.highlightedExROptionId,
	);
	const isHighlighted = highlightedExROptionId === uniqueOptionId;

	return (
		<HighlightWrapper
			id={`exr-option-${uniqueOptionId}`}
			isHighlighted={isHighlighted}
		>
			{isLeaf ? (
				<OptionRowContainer
					leading={<LargePoint />}
					content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
					className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
				/>
			) : (
				<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
			)}
		</HighlightWrapper>
	);
}
