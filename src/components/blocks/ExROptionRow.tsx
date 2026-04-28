import type { UniqueOptionId } from "../../type";
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
			leading={<span className="text-gray-500 select-none text-xs">・</span>}
			content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
			className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
		/>
	) : (
		<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
	);
}
