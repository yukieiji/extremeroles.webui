import { getIndentClass } from "@/logics/indentUtils";
import type { UniqueOptionId } from "@/type";
import { ExROptionRowViewContent } from "./ExROptionRowViewContent";

interface ExROptionRowViewProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	isLeaf?: boolean;
}

export function ExROptionRowView({
	uniqueOptionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowViewProps) {
	return isLeaf ? (
		<ExROptionRowViewContent
			uniqueOptionId={uniqueOptionId}
			indentClassName={getIndentClass(depth, 2)}
		/>
	) : (
		<ExROptionRowViewContent
			uniqueOptionId={uniqueOptionId}
			indentClassName={getIndentClass(depth, 2)}
		/>
	);
}
