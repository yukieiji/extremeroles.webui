import { ChildOptionViewAccordion } from "@/components/blocks/ChildOptionViewAccordion";
import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { exrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { ExROptionItemView } from "./ExROptionItemView";
import { ExROptionRowView } from "./ExROptionRowView";

interface ExROptionRecursiveItemViewProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

/**
 * 子要素を持つオプションをアコーディオンとして表示するコンポーネント
 */
export function ExROptionRecursiveItemView({
	uniqueOptionId,
	depth = 0,
}: ExROptionRecursiveItemViewProps) {
	const isOpen = useStore((state) => {
		return state.openedExROptionRightSidePanel[uniqueOptionId] ?? false;
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROptionRightSidePanel;
	});

	const handleToggle = () => {
		toggleExROption(uniqueOptionId);
	};

	const childs =
		exrOptionMetaData.options[uniqueOptionId]?.childOptionIds ?? [];

	return (
		<ChildOptionViewAccordion
			optionItem={
				<ExROptionRowView
					uniqueOptionId={uniqueOptionId}
					depth={depth}
					isLeaf={false}
				/>
			}
			isOpen={isOpen}
			onToggle={handleToggle}
			depth={depth}
		>
			<RightPanelContainer arr={childs} ignoreIndex={-1}>
				{(optionid) => (
					<ExROptionItemView uniqueOptionId={optionid} depth={depth + 1} />
				)}
			</RightPanelContainer>
		</ChildOptionViewAccordion>
	);
}
