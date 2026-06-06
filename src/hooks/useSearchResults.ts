import { useShallow } from "zustand/react/shallow";
import { globalSearchItems } from "@/logics/api";
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
			const lowerQuery = query.toLowerCase();
			return globalSearchItems
				.filter((item) => {
					if (!item.term.toLowerCase().includes(lowerQuery)) {
						return false;
					}
					return item.info.mode === "exr-opt"
						? (state.isExROptionActive[item.info.uniqueOptionId] ?? false)
						: true;
				})
				.slice(0, 10);
		}),
	);
}
