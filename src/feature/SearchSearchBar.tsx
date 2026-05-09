import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchNavigation } from "@/hooks/useOptionNavigation";
import { globalSearchItems } from "@/logics/api";
import { NO_SEARCH_RESULTS, SEARCH_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";

/**
 * オプションを検索する検索バーコンポーネント
 */
export function SearchSearchBar() {
	const [query, setQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const navigate = useSearchNavigation();
	const isExROptionActive = useStore((state) => state.isExROptionActive);

	const filteredItems = useMemo(() => {
		if (!query) {
			return [];
		}
		const lowerQuery = query.toLowerCase();
		return globalSearchItems
			.filter((item) => item.tearm.toLowerCase().includes(lowerQuery))
			.slice(0, 10); // 上位10件のみ表示
	}, [query]);

	return (
		<div className="relative w-64">
			<div className="relative">
				<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder={SEARCH_PLACEHOLDER}
					className="pl-9"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// クリックを処理するために少し遅らせる
						setTimeout(() => setIsFocused(false), 200);
					}}
				/>
			</div>

			{isFocused && query && (
				<div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
					{filteredItems.length > 0 ? (
						filteredItems.map((item) => {
							let isActive = true;
							if (item.info.mode === "exr-opt") {
								isActive = isExROptionActive[item.info.uniqueOptionId] ?? true;
							}

							return (
								<button
									key={item.id}
									type="button"
									className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex flex-col ${
										!isActive ? "opacity-50 grayscale" : ""
									}`}
									onClick={() => {
										navigate(item);
										setQuery("");
										setIsFocused(false);
									}}
								>
									<span className="font-medium">{item.tearm}</span>
									<span className="text-xs text-muted-foreground">
										{item.info.mode}
									</span>
								</button>
							);
						})
					) : (
						<div className="px-4 py-2 text-sm text-muted-foreground">
							{NO_SEARCH_RESULTS}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
