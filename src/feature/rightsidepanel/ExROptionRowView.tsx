import type { UniqueOptionId } from "../../type";
import { ExROptionRowViewContent } from "./ExROptionRowViewContent";

interface ExROptionRowViewProps {
	uniqueOptionId: UniqueOptionId;
	isLeaf?: boolean;
}

export function ExROptionRowView({
	uniqueOptionId,
	isLeaf = false,
}: ExROptionRowViewProps) {
	return isLeaf ? (
		<ExROptionRowViewContent uniqueOptionId={uniqueOptionId} />
	) : (
		<ExROptionRowViewContent uniqueOptionId={uniqueOptionId} />
	);
}
