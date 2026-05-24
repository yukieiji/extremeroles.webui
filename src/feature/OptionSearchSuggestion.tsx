import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useAuCategoryNavigationInline,
	useAuOptionNavigationInline,
	useExRCategoryNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { useStore } from "@/useStore";
import { OptionSearchSuggestionItem } from "./OptionSearchSuggestionItem";

/**
 * 検索クエリに基づいてフィルタリングされたアイテムを表示し、
 * 選択時のナビゲーションを管理するコンポーネント
 */
export function OptionSearchSuggestion() {
	const searchItems = useStore((state) => state.globalSearchItems);
	const query = useStore((state) => state.optionSearchQuery);
	const setQuery = useStore((state) => state.setOptionSearchQuery);
	const isExROptionActive = useStore((state) => state.isExROptionActive);

	const navigateToAuOption = useAuOptionNavigationInline();
	const navigateToAuCategory = useAuCategoryNavigationInline();
	const navigateToExROption = useExROptionNavigationInline();
	const navigateToExRCategory = useExRCategoryNavigationInline();

	// 検索クエリに基づいてフィルタリングされたアイテム
	const lowerQuery = query.toLowerCase();
	const filteredItems = query
		? searchItems.filter((item) => {
				const nameMatch = item.term.toLowerCase().includes(lowerQuery);
				if (!nameMatch) {
					return false;
				}

				// ExRのオプションの場合は、有効なもののみ表示
				if (item.info.mode === "exr-opt") {
					return isExROptionActive[item.info.uniqueOptionId] ?? false;
				}
				return true;
			})
		: [];

	if (filteredItems.length === 0) {
		return null;
	}

	const onSelect = (value: string | null) => {
		if (!value) {
			return;
		}
		const item = searchItems.find((i) => {
			return i.id === value;
		});
		if (!item) {
			return;
		}

		const info = item.info;
		if (info.mode === "au-opt") {
			navigateToAuOption(info.tabId, info.categoryId, info.auOptionId);
		} else if (info.mode === "au-cat") {
			navigateToAuCategory(info.tabId, info.categoryId);
		} else if (info.mode === "exr-opt") {
			navigateToExROption(info.uniqueOptionId);
		} else if (info.mode === "exr-cat") {
			navigateToExRCategory(info.tabId, info.categoryId);
		}
		// 選択後はクエリをクリア
		setQuery("");
	};

	return (
		<Select onValueChange={onSelect}>
			<SelectTrigger className="w-32">
				<SelectValue placeholder="結果" />
			</SelectTrigger>
			<SelectContent>
				{filteredItems.slice(0, 20).map((item) => {
					return <OptionSearchSuggestionItem key={item.id} item={item} />;
				})}
			</SelectContent>
		</Select>
	);
}
