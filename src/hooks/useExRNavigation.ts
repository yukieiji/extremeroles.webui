import { parseUniqueOptionId } from "../logics/optionUtils";
import type { ExRTabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * ExRの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useExRNavigation(uniqueOptionId: UniqueOptionId) {
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
	const setHighlightedExROptionId = useStore((state) => {
		return state.setHighlightedExROptionId;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);

	const navigateToExROption = () => {
		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId as ExRTabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}
		setHighlightedExROptionId(uniqueOptionId);

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(`exr-option-${uniqueOptionId}`);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			setTimeout(() => {
				setHighlightedExROptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToExROption;
}
