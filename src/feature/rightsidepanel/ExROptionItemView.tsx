import { useHasActiveOptionChild } from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";
import { ExROptionRecursiveItemView } from "./ExROptionRecursiveItemView";

import { ExROptionRowViewContent } from "./ExROptionRowViewContent";

interface ExROptionItemViewProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

export function ExROptionItemView({
	uniqueOptionId,
	depth = 0,
}: ExROptionItemViewProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return hasActiveChildren ? (
		<ExROptionRecursiveItemView uniqueOptionId={uniqueOptionId} depth={depth} />
	) : (
		<ExROptionRowViewContent uniqueOptionId={uniqueOptionId} depth={depth} />
	);
}
