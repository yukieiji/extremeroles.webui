import {
	useAuCategoryNavigationInline,
	useAuOptionNavigationInline,
	useExRCategoryNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

/**
 * 検索結果アイテムが選択された際のナビゲーションとポップオーバーのクローズを行うフック。
 */
export function useSearchSelection() {
	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();
	const navigateToExRCat = useExRCategoryNavigationInline();
	const navigateToAuCat = useAuCategoryNavigationInline();
	const setIsOpen = useStore((state) => state.setSuggestOpen);

	return (selectedItem: SearchItem) => {
		if (selectedItem.info.mode === "exr-opt") {
			navigateToExR(selectedItem.info.uniqueOptionId);
			setIsOpen(false);
		} else if (selectedItem.info.mode === "au-opt") {
			navigateToAu(
				selectedItem.info.tabId,
				selectedItem.info.categoryId,
				selectedItem.info.auOptionId,
			);
			setIsOpen(false);
		} else if (selectedItem.info.mode === "exr-cat") {
			navigateToExRCat(selectedItem.info.tabId, selectedItem.info.categoryId);
			setIsOpen(false);
		} else if (selectedItem.info.mode === "au-cat") {
			navigateToAuCat(selectedItem.info.tabId, selectedItem.info.categoryId);
			setIsOpen(false);
		}
	};
}
