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

export function createExRCategoryNavigateId(categoryId: number) {
	return `exr-category-${categoryId}`;
}

export function createAuCategoryNavigateId(categoryId: number) {
	return `au-category-${categoryId}`;
}

function useNavigate() {
	return (navId: string, timeoutFunc: () => void) => {
		const startTime = Date.now();
		const timeout = 1000; // 1秒間トライする

		const tryScroll = () => {
			if (typeof document !== "undefined") {
				const element = document.getElementById(navId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
					setTimeout(timeoutFunc, 2000);
					return;
				}
			}

			if (Date.now() - startTime < timeout) {
				requestAnimationFrame(tryScroll);
			} else {
				// タイムアウトしても一応終了処理は呼ぶ
				setTimeout(timeoutFunc, 2000);
			}
		};

		// 最初の呼び出しは少し待つ（タブ切り替えやアニメーションの開始を待つ）
		setTimeout(tryScroll, 100);
	};
}

function useAuNavigationInner() {
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

	const nav = useNavigate();

	const navigation = (
		tabId: number,
		categoryId: number,
		optionId: AuOptionId,
		navId: string,
	) => {
		const { openedAuCategoryIds } = useStore.getState();
		setSelectedTab("Au");
		setSelectedAuTabId(tabId);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		nav(navId, () => {
			setHighlightedAuOptionId(null);
		});
	};
	return navigation;
}

/**
 * Auの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useAuOptionNavigation(
	tabId: number,
	categoryId: number,
	optionId: AuOptionId,
) {
	const navigateToAuOption = useAuNavigationInner();

	const navigateId = createAuNavigateId(optionId);
	const navigateToOption = () => {
		navigateToAuOption(tabId, categoryId, optionId, navigateId);
	};

	return navigateToOption;
}

function useAuCategoryNavigationInner() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const setAuCategoryOpen = useStore((state) => state.setAuCategoryOpen);
	const setHighlightedAuCategoryId = useStore(
		(state) => state.setHighlightedAuCategoryId,
	);

	const nav = useNavigate();

	return (tabId: number, categoryId: number, navId: string) => {
		setSelectedTab("Au");
		setSelectedAuTabId(tabId);
		setAuCategoryOpen(categoryId, true);
		setHighlightedAuCategoryId(categoryId);

		nav(navId, () => {
			setHighlightedAuCategoryId(null);
		});
	};
}

export function useAuCategoryNavigationInline() {
	const navigateToAuCategory = useAuCategoryNavigationInner();

	return (tabId: number, categoryId: number) => {
		const navigateId = createAuCategoryNavigateId(categoryId);
		navigateToAuCategory(tabId, categoryId, navigateId);
	};
}

export function useAuOptionNavigationInline() {
	const navigateToAuOption = useAuNavigationInner();

	const navigateToOption = (
		tabId: number,
		categoryId: number,
		optionId: AuOptionId,
	) => {
		const navigateId = createAuNavigateId(optionId);
		navigateToAuOption(tabId, categoryId, optionId, navigateId);
	};

	return navigateToOption;
}

function useExRCategoryNavigationInner() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedExRTabId = useStore((state) => state.setSelectedExRTabId);
	const setExRCategoryOpen = useStore((state) => state.setExRCategoryOpen);
	const setHighlightedExRCategoryId = useStore(
		(state) => state.setHighlightedExRCategoryId,
	);

	const nav = useNavigate();

	return (tabId: ExRTabId, categoryId: number, navId: string) => {
		setSelectedTab("ExR");
		setSelectedExRTabId(tabId);
		setExRCategoryOpen(categoryId, true);
		setHighlightedExRCategoryId(categoryId);

		nav(navId, () => {
			setHighlightedExRCategoryId(null);
		});
	};
}

export function useExRCategoryNavigationInline() {
	const navigateToExRCategory = useExRCategoryNavigationInner();

	return (tabId: ExRTabId, categoryId: number) => {
		const navigateId = createExRCategoryNavigateId(categoryId);
		navigateToExRCategory(tabId, categoryId, navigateId);
	};
}

/**
 * ExRの設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */

function useExROptionNavigationInner() {
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

	const nav = useNavigate();

	const navigateToOption = (
		tabId: ExRTabId,
		categoryId: number,
		navId: string,
		uniqueOptionId: UniqueOptionId,
	) => {
		const { openedExRCategoryIds } = useStore.getState();

		setSelectedTab("ExR");
		setSelectedExRTabId(tabId as ExRTabId);
		if (!openedExRCategoryIds[categoryId]) {
			toggleExRCategory(categoryId);
		}

		// 全ての親オプションを特定して開く
		const ancestors =
			exrOptionMetaData.options[uniqueOptionId]?.parentOptionIds ?? [];
		if (ancestors.length > 0) {
			openExROptions(ancestors);
		}

		setHighlightedExROptionId(uniqueOptionId);

		nav(navId, () => {
			setHighlightedExROptionId(null);
		});
	};
	return navigateToOption;
}

export function useExROptionNavigation(uniqueOptionId: UniqueOptionId) {
	const navigateToOptionInner = useExROptionNavigationInner();

	const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
	const navigateId = createExRNavigateId(uniqueOptionId);

	const navigateToOption = () => {
		navigateToOptionInner(tabId, categoryId, navigateId, uniqueOptionId);
	};

	return navigateToOption;
}

export function useExROptionNavigationInline() {
	const navigateToOptionInner = useExROptionNavigationInner();

	const navigateToOption = (uniqueOptionId: UniqueOptionId) => {
		const { tabId, categoryId } = parseUniqueOptionId(uniqueOptionId);
		const navigateId = createExRNavigateId(uniqueOptionId);
		navigateToOptionInner(tabId, categoryId, navigateId, uniqueOptionId);
	};

	return navigateToOption;
}
