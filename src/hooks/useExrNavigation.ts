import type { ExRTabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * ExRの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useExrNavigation() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedExRTabId = useStore((state) => state.setSelectedExRTabId);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);
	const openedExRCategoryIds = useStore((state) => state.openedExRCategoryIds);
	const setHighlightedExROptionId = useStore(
		(state) => state.setHighlightedExROptionId,
	);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const navigateToOption = (
		tabId: ExRTabId,
		categoryId: number,
		uniqueOptionId: UniqueOptionId,
	) => {
		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}
		setHighlightedExROptionId(uniqueOptionId);

		setTimeout(() => {
			const element = document.getElementById(`exr-option-${uniqueOptionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedExROptionId(null);
			}, 2000);
		}, 100);
	};

	return { navigateToOption };
}
