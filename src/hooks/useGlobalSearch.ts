import { exrOptionMetaData, globalSearchItems } from "@/logics/api";
import type { ExRTabId, SearchItem } from "@/type";
import { useStore } from "@/useStore";
import { createAuNavigateId, createExRNavigateId } from "./useOptionNavigation";

/**
 * 検索項目を選択した際のナビゲーションロジック
 */
export function useSearchNavigation() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedExRTabId = useStore((state) => state.setSelectedExRTabId);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openExROptions = useStore((state) => state.openExROptions);
	const setHighlightedExROptionId = useStore(
		(state) => state.setHighlightedExROptionId,
	);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const navigateToItem = (item: SearchItem) => {
		setRightPanelOpen(false);
		setSelectedTab(item.mode);

		if (item.mode === "ExR") {
			setSelectedExRTabId(item.tabId as ExRTabId);
			const { openedExRCategoryIds } = useStore.getState();
			if (!openedExRCategoryIds[item.categoryId]) {
				toggleExRCategory(item.categoryId);
			}

			if (item.type === "option" && item.uniqueOptionId) {
				const ancestors =
					exrOptionMetaData.options[item.uniqueOptionId]?.parentOptionIds ?? [];
				if (ancestors.length > 0) {
					openExROptions(ancestors);
				}
				setHighlightedExROptionId(item.uniqueOptionId);
				const navigateId = createExRNavigateId(item.uniqueOptionId);

				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
					setTimeout(() => {
						setHighlightedExROptionId(null);
					}, 2000);
				}, 100);
			} else {
				// For categories, we might want to highlight the category header or just scroll to it
				const navigateId = `exr-category-${item.categoryId}`;
				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 100);
			}
		} else {
			setSelectedAuTabId(item.tabId);
			const { openedAuCategoryIds } = useStore.getState();
			if (!openedAuCategoryIds[item.categoryId]) {
				toggleAuCategory(item.categoryId);
			}

			if (item.type === "option" && typeof item.optionId === "number") {
				const auOptionId = item.optionId as number;
				setHighlightedAuOptionId(auOptionId);
				const navigateId = createAuNavigateId(auOptionId);

				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
					setTimeout(() => {
						setHighlightedAuOptionId(null);
					}, 2000);
				}, 100);
			} else {
				const navigateId = `au-category-${item.categoryId}`;
				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 100);
			}
		}
	};

	return { navigateToItem, globalSearchItems };
}
