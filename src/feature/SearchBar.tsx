import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { globalSearchItems } from "@/logics/api";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

/**
 * オプションやカテゴリをを検索するための検索バーコンポーネント。
 */
export function SearchBar() {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [results, setResults] = useState<SearchItem[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);

	const isExROptionActive = useStore((state) => state.isExROptionActive);
	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();

	useEffect(() => {
		if (query.trim() === "") {
			setResults([]);
			return;
		}

		const lowerQuery = query.toLowerCase();
		const filtered = globalSearchItems.filter((item) => {
			if (!item.term.toLowerCase().includes(lowerQuery)) {
				return false;
			}

			// ExRオプションの場合はアクティブチェックを行う
			if (item.info.mode === "exr-opt") {
				return isExROptionActive[item.info.uniqueOptionId] ?? false;
			}

			return true;
		});

		setResults(filtered.slice(0, 10)); // 最大10件表示
	}, [query, isExROptionActive]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSelect = (item: SearchItem) => {
		if (item.info.mode === "exr-opt") {
			navigateToExR(item.info.uniqueOptionId);
		} else if (item.info.mode === "au-opt") {
			navigateToAu(item.info.tabId, item.info.categoryId, item.info.auOptionId);
		}
		setIsOpen(false);
		setQuery("");
	};

	return (
		<div className="relative w-64" ref={containerRef}>
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<Search className="size-4 text-muted-foreground" />
				</InputGroupAddon>
				<InputGroupInput
					placeholder={OPTION_SEARCH_PLACEHOLDER}
					type="search"
					className="flex-1"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
				/>
			</InputGroup>

			{isOpen && results.length > 0 && (
				<div className="absolute top-full left-0 w-full mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
					<ul className="max-h-60 overflow-y-auto py-1">
						{results.map((item) => (
							<li key={item.id}>
								<button
									type="button"
									className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
									onClick={() => handleSelect(item)}
								>
									{item.term}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
