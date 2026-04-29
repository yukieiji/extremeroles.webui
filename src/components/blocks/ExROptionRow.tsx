import type { UniqueOptionId } from "../../type";
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
	return isLeaf ? (
		<OptionRowContainer
			id={`exr-option-${uniqueOptionId}`}
			leading={<LargePoint />}
			content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
			className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
		/>
	) : (
		<div id={`exr-option-${uniqueOptionId}`}>
			<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
		</div>
	);
}
