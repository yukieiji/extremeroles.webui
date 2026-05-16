import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import { ExROptionRowContent } from "@/feature/exr/ExROptionRowContent";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

interface ExROptionRowProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	isLeaf?: boolean;
}

interface ExROptionRowInnerProps {
	uniqueOptionId: UniqueOptionId;
	depth: number;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
function ExROptionRowInner({ uniqueOptionId, depth }: ExROptionRowInnerProps) {
	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === uniqueOptionId;
	});

	const navigateId = createExRNavigateId(uniqueOptionId);
	const paddingLeft = depth > 0 ? `${depth * 1}rem` : "0";

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={true}
		>
			<OptionRowContainer
				leading={<LargePoint />}
				content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
				style={{ paddingLeft: `calc(0.375rem + ${paddingLeft})` }}
			/>
		</HighlightWrapper>
	);
}

export function ExROptionRow({
	uniqueOptionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	return isLeaf ? (
		<ExROptionRowInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : (
		<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
	);
}
