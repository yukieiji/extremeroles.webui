import { useShallow } from "zustand/react/shallow";
import { globalSearchItems } from "@/logics/api";
import { normalizeForSearch } from "@/logics/stringUtils";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

/**
 * 検索クエリに基づいて検索結果をフィルタリングするフック。
 */
export function useSearchResults(): SearchItem[] {
	return useStore(
		useShallow((state) => {
			const query = state.optionSearchQuery.trim();
			if (query === "") {
				return [];
			}
			const normalizedQuery = normalizeForSearch(query);
			return globalSearchItems
				.filter((item) => {
					if (!normalizeForSearch(item.term).includes(normalizedQuery)) {
						return false;
					}
					if (item.info.mode === "exr-opt") {
						const displayMode =
							state.appSetting?.inactiveOptionDisplay ?? "hidden";
						if (displayMode !== "hidden") {
							return true;
						}
						return state.isExROptionActive[item.info.uniqueOptionId] ?? false;
					}
					return true;
				})
				.slice(0, 10);
		}),
	);
}
