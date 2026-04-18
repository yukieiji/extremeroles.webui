import { OptionAccordion } from "../components/blocks/OptionAccordion";
import { exrOptionMetaData } from "../logics/api";
import {
	getOptionIdFromUniqueId,
	getUniqueOptionId,
} from "../logics/optionUtils";
import { useStore } from "../useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExROptionRow } from "./ExROptionRow";

interface ExROptionRecursiveItemProps {
	categoryId: number;
	optionId: number;
	depth: number;
}

/**
 * 子要素を持つオプションをアコーディオンとして表示するコンポーネント
 */
export function ExROptionRecursiveItem({
	categoryId,
	optionId,
	depth = 0,
}: ExROptionRecursiveItemProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, optionId);
	const isOpen = useStore((state) => {
		return state.openedExROptionIds[uniqueId];
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROption;
	});

	const handleToggle = () => {
		toggleExROption(uniqueId);
	};

	const childOptionIds = (exrOptionMetaData.childOptionMap[uniqueId] ?? []).map(
		(id) => {
			// childOptionMap contains full unique IDs because of how I implemented api.ts
			// Wait, let me double check api.ts
			return id;
		},
	);

	const isOptionActive = useStore((state) => {
		return state.isOptionActive;
	});

	const hasActiveChildren = childOptionIds.some((cid) => {
		return isOptionActive[cid];
	});

	return (
		<OptionAccordion
			optionItem={
				<ExROptionRow
					categoryId={categoryId}
					optionId={optionId}
					depth={depth}
					isLeaf={false}
				/>
			}
			isOpen={isOpen ?? false}
			onToggle={handleToggle}
			showArrow={hasActiveChildren}
			className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
		>
			<div className="flex flex-col">
				{childOptionIds.map((cid) => {
					const originalOptionId = getOptionIdFromUniqueId(cid);
					return (
						<ExROptionItem
							key={cid}
							categoryId={categoryId}
							optionId={originalOptionId}
							depth={depth + 1}
						/>
					);
				})}
			</div>
		</OptionAccordion>
	);
}
