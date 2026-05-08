import { exrOptionMetaData } from "../logics/api";
import type { AuOptionId, ExRTabId, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

export function createExRNavigateId(uniqueOptionId: UniqueOptionId) {
	return `exr-option-${uniqueOptionId}`;
}

export function createAuNavigateId(auOptionId: AuOptionId) {
	return `au-option-${auOptionId}`;
}

export function createExRCategoryNavigateId(categoryId: number) {
	return `exr-category-${categoryId}`;
}

export function createAuCategoryNavigateId(categoryId: number) {
	return `au-category-${categoryId}`;
}

/**
 * Auの設定項目へのナビゲーションを行うフック
 */
export function useAuNavigation() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const navigateToAu = (
		tabId: number,
		categoryId: number,
		optionId?: AuOptionId,
	) => {
		const { openedAuCategoryIds } = useStore.getState();

		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(tabId);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}

		const navigateId =
			optionId !== undefined
				? createAuNavigateId(optionId)
				: createAuCategoryNavigateId(categoryId);

		if (optionId !== undefined) {
			setHighlightedAuOptionId(optionId);
		}

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(navigateId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			if (optionId !== undefined) {
				setTimeout(() => {
					setHighlightedAuOptionId(null);
				}, 2000);
			}
		}, 100);
	};

	return navigateToAu;
}

/**
 * ExRの設定項目へのナビゲーションを行うフック
 */
export function useExRNavigation() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedExRTabId = useStore((state) => state.setSelectedExRTabId);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);
	const openExROptions = useStore((state) => state.openExROptions);
	const setHighlightedExROptionId = useStore(
		(state) => state.setHighlightedExROptionId,
	);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const navigateToExR = (
		tabId: ExRTabId,
		categoryId: number,
		uniqueOptionId?: UniqueOptionId,
	) => {
		const { openedExRCategoryIds } = useStore.getState();

		setRightPanelOpen(false);
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}

		if (uniqueOptionId !== undefined) {
			// 全ての親オプションを特定して開く
			const ancestors =
				exrOptionMetaData.options[uniqueOptionId]?.parentOptionIds ?? [];
			if (ancestors.length > 0) {
				openExROptions(ancestors);
			}

			setHighlightedExROptionId(uniqueOptionId);
		}

		const navigateId =
			uniqueOptionId !== undefined
				? createExRNavigateId(uniqueOptionId)
				: createExRCategoryNavigateId(categoryId);

		setTimeout(() => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(navigateId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
			if (uniqueOptionId !== undefined) {
				setTimeout(() => {
					setHighlightedExROptionId(null);
				}, 2000);
			}
		}, 100);
	};

	return navigateToExR;
}
