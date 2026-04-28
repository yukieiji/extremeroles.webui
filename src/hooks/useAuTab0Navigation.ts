import type { AuOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * Auのタブ0の設定項目をダブルクリックした際のナビゲーションとハイライトを行うフック
 */
export function useAuTab0Navigation() {
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

	const navigateToOption = (categoryId: number, optionId: AuOptionId) => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(0);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		setTimeout(() => {
			const element = document.getElementById(`au-option-${optionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return { navigateToOption };
}
