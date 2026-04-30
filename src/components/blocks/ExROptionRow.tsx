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
			leading={<LargePoint />}
			content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
			className={depth > 0 ? "pl-4" : ""}
		/>
	) : (
		<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
	);
}
