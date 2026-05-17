import { RightPanelBorderLine } from "@/components/parts/RightPanelBorderLine";
import {
	useHasActiveOptionChild,
	useOptionActive,
} from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";
import { ExROptionRecursiveItemView } from "./ExROptionRecursiveItemView";
import { ExROptionRowView } from "./ExROptionRowView";

interface ExROptionItemViewProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	withBorder?: boolean;
}

function ExROptionItemViewInner({
	uniqueOptionId,
	depth = 0,
	withBorder = false,
}: ExROptionItemViewProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return (
		<>
			{withBorder && (
				<RightPanelBorderLine className="first:hidden" depth={depth} />
			)}
			{hasActiveChildren ? (
				<ExROptionRecursiveItemView
					uniqueOptionId={uniqueOptionId}
					depth={depth}
				/>
			) : (
				<ExROptionRowView
					uniqueOptionId={uniqueOptionId}
					depth={depth}
					isLeaf={true}
				/>
			)}
		</>
	);
}

export function ExROptionItemView({
	uniqueOptionId,
	depth = 0,
	withBorder = false,
}: ExROptionItemViewProps) {
	const isActive = useOptionActive(uniqueOptionId);
	return isActive ? (
		<ExROptionItemViewInner
			uniqueOptionId={uniqueOptionId}
			depth={depth}
			withBorder={withBorder}
		/>
	) : null;
}
