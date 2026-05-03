import { OptionEditableAccordion } from "../../components/blocks/OptionEditableAccordion";
import { OptionEditorCategoryOptionLayout } from "../../components/blocks/OptionEditorCategoryOptionLayout";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
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
		return state.openedExROptionIds[uniqueOptionId];
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROption;
	});

	const handleToggle = () => {
		toggleExROption(uniqueOptionId);
	};

	const childs =
		exrOptionMetaData.options[uniqueOptionId]?.childOptionIds ?? [];

	return (
		<OptionEditableAccordion
			optionItem={
				<ExROptionRow
					uniqueOptionId={uniqueOptionId}
					depth={depth}
					isLeaf={false}
				/>
			}
			isOpen={isOpen ?? false}
			onToggle={handleToggle}
			depth={depth}
		>
			<OptionEditorCategoryOptionLayout arr={childs}>
				{(childId) => (
					<ExROptionItem uniqueOptionId={childId} depth={depth + 1} />
				)}
			</OptionEditorCategoryOptionLayout>
		</OptionEditableAccordion>
	);
}
