import { exrOptionMetaData } from "../logics/api";
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
	const setSelectedTab = useStore((state) => {
		return state.setSelectedTab;
	});
	const setSelectedAuTabId = useStore((state) => {
		return state.setSelectedAuTabId;
	});
	const toggleAuCategory = useStore((state) => {
		return state.toggleAuCategory;
	});
	const setHighlightedAuOptionId = useStore((state) => {
		return state.setHighlightedAuOptionId;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const navigateId = createAuNavigateId(optionId);

	const navigateToOption = () => {
		const { openedAuCategoryIds } = useStore.getState();

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
	const openExROptions = useStore((state) => {
		return state.openExROptions;
	});

	const setHighlightedExROptionId = useStore((state) => {
		return state.setHighlightedExROptionId;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
	const navigateId = createExRNavigateId(uniqueOptionId);

	const navigateToOption = () => {
		const { openedExRCategoryIds } = useStore.getState();

		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId as ExRTabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}

		// 全ての親オプションを特定して開く
		const ancestors = exrOptionMetaData.options[uniqueOptionId]?.parentOptionIds ?? [];
		if (ancestors.length > 0) {
			openExROptions(ancestors);
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
				setHighlightedExROptionId(null);
			}, 2000);
		}, 100);
	};

	return navigateToOption;
}
