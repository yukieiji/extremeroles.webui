import { ColoredText } from "../../components/parts/ColoredText";
import {
	useHasActiveOptiopnChild,
	useOptionActive,
} from "../../hooks/useExROptionData";
import type { UniqueOptionId } from "../../type";
import { ExROptionRowView } from "./ExROptionRowView";

interface ExROptionItemViewProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

function ExROptionItemViewInner({
	uniqueOptionId,
	depth = 0,
}: ExROptionItemViewProps) {
	const hasActiveChildren = useHasActiveOptiopnChild(uniqueOptionId);
	if (hasActiveChildren) {
		return <ColoredText text={String(uniqueOptionId)} />;
	}

	return (
		<ExROptionRowView
			uniqueOptionId={uniqueOptionId}
			depth={depth}
			isLeaf={true}
		/>
	);
}

export function ExROptionItemView({
	uniqueOptionId,
	depth = 0,
}: ExROptionItemViewProps) {
	const isActive = useOptionActive(uniqueOptionId);
	return isActive ? (
		<ExROptionItemViewInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : null;
}
