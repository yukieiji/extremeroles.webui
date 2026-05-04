import { parseUniqueOptionId } from "../logics/optionUtils";
import type { AuOptionId, ExRTabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

export function createExRNavigateId(uniqueOptionId: UniqueOptionId) {
	return `exr-option-${uniqueOptionId}`;
}

export function createAuNavigateId(auOptionId: AuOptionId) {
	return `au-option-${auOptionId}`;
}

/**
 * Auの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useAuNavigation(
	tabId: number,
	categoryId: number,
	optionId: AuOptionId,
) {
	const navigateId = createAuNavigateId(optionId);

	const navigateToOption = () => {
		const {
			setRightPanelOpen,
			setSelectedTab,
			setSelectedAuTabId,
			openedAuCategoryIds,
			toggleAuCategory,
			setHighlightedAuOptionId,
		} = useStore.getState();

		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(tabId);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(navigateId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			setTimeout(() => {
				useStore.getState().setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToOption;
}
/**
 * ExRの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useExRNavigation(uniqueOptionId: UniqueOptionId) {
	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
	const navigateId = createExRNavigateId(uniqueOptionId);

	const navigateToOption = () => {
		const {
			setRightPanelOpen,
			setSelectedTab,
			setSelectedExRTabId,
			openedExRCategoryIds,
			toggleExRCategory,
			setHighlightedExROptionId,
		} = useStore.getState();

		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId as ExRTabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}
		setHighlightedExROptionId(uniqueOptionId);

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(navigateId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			setTimeout(() => {
				useStore.getState().setHighlightedExROptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToOption;
}
