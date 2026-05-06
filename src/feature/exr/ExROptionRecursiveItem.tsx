import { HighlightableAccordionRow } from "@/components/blocks/HighlightableAccordionRow";
import { RowCustomizeAccordion } from "@/components/blocks/OptionEditableAccordion";
import { OptionEditorCategoryOptionLayout } from "@/components/blocks/OptionEditorCategoryOptionLayout";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExROptionRow } from "./ExROptionRow";

interface ExROptionRecursiveItemProps {
	uniqueOptionId: UniqueOptionId;
	depth: number;
}

/**
 * 子要素を持つオプションをアコーディオンとして表示するコンポーネント
 */
export function ExROptionRecursiveItem({
	uniqueOptionId,
	depth = 0,
}: ExROptionRecursiveItemProps) {
	const isOpen = useStore((state) => {
		return state.openedExROptionIds[uniqueOptionId] ?? false;
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROption;
	});

	const handleToggle = () => {
		toggleExROption(uniqueOptionId);
	};
	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === uniqueOptionId;
	});

	const childs =
		exrOptionMetaData.options[uniqueOptionId]?.childOptionIds ?? [];

	const navigateId = createExRNavigateId(uniqueOptionId);

	return (
		<RowCustomizeAccordion
			row={
				<HighlightableAccordionRow
					id={navigateId}
					onToggle={handleToggle}
					isOpen={isOpen}
					isHighlight={isHighlighted}
				>
					<ExROptionRow
						uniqueOptionId={uniqueOptionId}
						depth={depth}
						isLeaf={false}
					/>
				</HighlightableAccordionRow>
			}
			isOpen={isOpen}
			depth={depth}
		>
			<OptionEditorCategoryOptionLayout arr={childs} ignoreIndex={-1}>
				{(childId) => (
					<ExROptionItem uniqueOptionId={childId} depth={depth + 1} />
				)}
			</OptionEditorCategoryOptionLayout>
		</RowCustomizeAccordion>
	);
}
