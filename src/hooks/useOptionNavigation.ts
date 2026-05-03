import { parseUniqueOptionId } from "../logics/optionUtils";
import type { AuOptionId, ExRTabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * Auの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useAuNavigation(
	tabId: number,
	categoryId: number,
	optionId: AuOptionId,
) {
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
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});
	const navigateToOption = () => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(tabId);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(`au-option-${optionId}`);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToOption;
}
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

	const navigateToOption = () => {
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
					element.scrollIntoView({ behavior: "smooth" });
				}
			}
			setTimeout(() => {
				setHighlightedExROptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToOption;
}
