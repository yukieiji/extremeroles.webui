import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuTab0OptionRow } from "./AuTab0OptionRow";

interface AuTab0MapCategoryProps {
	categoryId: number;
}

/**
 * Map用カテゴリコンポーネント (最初の項目がヘッダーに統合される)
 */
export function AuTab0MapCategory({ categoryId }: AuTab0MapCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const auValue = useStore((state) => {
		return state.auValue;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});
	const setSelectedTab = useStore((state) => {
		return state.setSelectedTab;
	});
	const setSelectedAuTabId = useStore((state) => {
		return state.setSelectedAuTabId;
	});
	const toggleAuCategory = useStore((state) => {
		return state.toggleAuCategory;
	});
	const openedAuCategoryIds = useStore((state) => {
		return state.openedAuCategoryIds;
	});
	const setHighlightedAuOptionId = useStore((state) => {
		return state.setHighlightedAuOptionId;
	});

	if (!categoryMeta) {
		return null;
	}

	const mapOptionId = categoryMeta.options[0];
	const otherOptionIds = categoryMeta.options.slice(1);
	const mapOptionMeta = auOptionMetaData.options[mapOptionId];

	if (!mapOptionMeta) {
		return null;
	}

	const mapValue = mapOptionMeta.range[auValue[mapOptionId] ?? 0];

	const handleHeaderDoubleClick = () => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(0);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(mapOptionId);

		setTimeout(() => {
			const element = document.getElementById(`au-option-${mapOptionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-1">
			<button
				type="button"
				data-testid={`right-panel-option-${mapOptionId}`}
				onDoubleClick={handleHeaderDoubleClick}
				className="w-full flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
			>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4" />
					<span className="font-semibold text-gray-200 text-sm">
						{mapOptionMeta.title}
					</span>
				</div>
				<span className="text-sm text-blue-400 font-medium">
					{mapValue.toString()}
				</span>
			</button>
			{otherOptionIds.length > 0 && (
				<div className="p-1 bg-gray-900 space-y-0.5">
					{otherOptionIds.map((optionId) => {
						return (
							<AuTab0OptionRow
								key={optionId}
								optionId={optionId}
								categoryId={categoryId}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
