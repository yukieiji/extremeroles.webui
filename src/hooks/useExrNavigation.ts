import type { TabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * ExRの設定項目をダブルクリックした際のナビゲーションを行うフック
 */
export function useExrNavigation() {
	const setSelectedTab = useStore((state) => {
		return state.setSelectedTab;
	});
	const setSelectedExRTabId = useStore((state) => {
		return state.setSelectedExRTabId;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});
	const openedExRCategoryIds = useStore((state) => {
		return state.openedExRCategoryIds;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const navigateToOption = (
		tabId: TabId,
		categoryId: number,
		uniqueOptionId: UniqueOptionId,
	) => {
		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(`exr-option-${uniqueOptionId}`);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
		}, 100);
	};

	return { navigateToOption };
}
