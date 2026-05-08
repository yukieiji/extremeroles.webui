import { globalSearchItems } from "@/logics/api";
import type { ExRTabId, SearchItem } from "@/type";
import { useAuNavigation, useExRNavigation } from "./useOptionNavigation";

/**
 * 検索項目を選択した際のナビゲーションロジック
 */
export function useSearchNavigation() {
	const navigateToAu = useAuNavigation();
	const navigateToExR = useExRNavigation();

	const navigateToItem = (item: SearchItem) => {
		if (item.mode === "ExR") {
			navigateToExR(
				item.tabId as ExRTabId,
				item.categoryId,
				item.uniqueOptionId,
			);
		} else {
			navigateToAu(item.tabId, item.categoryId, item.optionId as number);
		}
	};

	return { navigateToItem, globalSearchItems };
}
