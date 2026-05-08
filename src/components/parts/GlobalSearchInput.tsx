import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchNavigation } from "@/hooks/useGlobalSearch";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

/**
 * カラータグを除去した名前を取得します
 */
function stripColorTags(text: string): string {
	return text.replace(/<color=[^>]+>|<\/color>/g, "");
}

/**
 * 全体検索用の入力フィールドとサジェスト
 */
export function GlobalSearchInput() {
	const query = useStore((state) => state.globalSearchQuery);
	const setQuery = useStore((state) => state.setGlobalSearchQuery);
	const isOpen = useStore((state) => state.isGlobalSearchOpen);
	const setIsOpen = useStore((state) => state.setIsGlobalSearchOpen);

	const { navigateToItem, globalSearchItems } = useSearchNavigation();
	const containerRef = useRef<HTMLDivElement>(null);

	const filteredItems = query
		? globalSearchItems.filter((item) =>
				stripColorTags(item.name).toLowerCase().includes(query.toLowerCase()),
			)
		: [];

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
	}, [setIsOpen]);

	const handleSelect = (item: SearchItem) => {
		navigateToItem(item);
		setIsOpen(false);
		setQuery("");
	};

	return (
		<div className="relative w-64" ref={containerRef}>
			<InputGroup>
				<InputGroupInput
					placeholder="オプションを検索..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
				/>
				<InputGroupAddon align="inline-start">
					<Search size={20} aria-hidden="true" />
				</InputGroupAddon>
			</InputGroup>

			{isOpen && filteredItems.length > 0 && (
				<ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
					{filteredItems.map((item) => (
						<li key={item.id}>
							<button
								type="button"
								className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex flex-col"
								onClick={() => handleSelect(item)}
							>
								<span className="text-sm font-medium">
									{stripColorTags(item.name)}
								</span>
								<span className="text-xs text-gray-500">
									{item.mode} -{" "}
									{item.type === "category" ? "カテゴリー" : "オプション"}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
