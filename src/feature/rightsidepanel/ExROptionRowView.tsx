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
}: ExROptionRowViewProps) {
	return (
		<ExROptionRowViewContent uniqueOptionId={uniqueOptionId} depth={depth} />
	);
}
