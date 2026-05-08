import { auOptionMetaData, exrOptionMetaData } from "@/logics/api";
import { parseUniqueOptionId } from "@/logics/optionUtils";
import type { AuOptionId, ExRTabId, UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";
import { createAuNavigateId, createExRNavigateId } from "./useOptionNavigation";

export type SearchItemType = "category" | "option";
export type SearchItemMode = "Au" | "ExR";

export interface SearchItem {
	id: string;
	name: string;
	type: SearchItemType;
	mode: SearchItemMode;
	// Navigation data
	tabId: number;
	categoryId: number;
	optionId?: number | UniqueOptionId | AuOptionId;
	uniqueOptionId?: UniqueOptionId;
}

/**
 * 全ての検索対象（カテゴリーとオプション）を取得します
 */
export function getAllSearchItems(): SearchItem[] {
	const items: SearchItem[] = [];

	// ExR Categories
	for (const [id, category] of Object.entries(exrOptionMetaData.categories)) {
		items.push({
			id: `exr-cat-${id}`,
			name: category.name,
			type: "category",
			mode: "ExR",
			tabId: category.tabId,
			categoryId: Number(id),
		});
	}

	// ExR Options
	for (const [id, option] of Object.entries(exrOptionMetaData.options)) {
		const uniqueId = Number(id) as UniqueOptionId;
		const { tabId, categoryId } = parseUniqueOptionId(uniqueId);
		if (option.metaData.translatedName) {
			items.push({
				id: `exr-opt-${id}`,
				name: option.metaData.translatedName,
				type: "option",
				mode: "ExR",
				tabId,
				categoryId,
				optionId: uniqueId,
				uniqueOptionId: uniqueId,
			});
		}
	}

	// Au Categories
	for (const [tabId, categoryIds] of Object.entries(
		auOptionMetaData.tabCategoryMap,
	)) {
		for (const categoryId of categoryIds) {
			const category = auOptionMetaData.categoryMetaData[categoryId];
			if (category) {
				items.push({
					id: `au-cat-${categoryId}`,
					name: category.name,
					type: "category",
					mode: "Au",
					tabId: Number(tabId),
					categoryId,
				});
			}
		}
	}

	// Au Options
	for (const [id, option] of Object.entries(auOptionMetaData.options)) {
		const auOptionId = Number(id) as AuOptionId;
		// Find tab and category for this option
		let foundTabId = -1;
		let foundCategoryId = -1;

		for (const [tId, catIds] of Object.entries(
			auOptionMetaData.tabCategoryMap,
		)) {
			for (const cId of catIds) {
				if (
					auOptionMetaData.categoryMetaData[cId]?.options.includes(auOptionId)
				) {
					foundTabId = Number(tId);
					foundCategoryId = cId;
					break;
				}
			}
			if (foundTabId !== -1) {
				break;
			}
		}

		if (foundTabId !== -1) {
			items.push({
				id: `au-opt-${id}`,
				name: option.title,
				type: "option",
				mode: "Au",
				tabId: foundTabId,
				categoryId: foundCategoryId,
				optionId: auOptionId,
			});
		}
	}

	return items.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 検索項目を選択した際のナビゲーションロジック
 */
export function useSearchNavigation() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedExRTabId = useStore((state) => state.setSelectedExRTabId);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openExROptions = useStore((state) => state.openExROptions);
	const setHighlightedExROptionId = useStore(
		(state) => state.setHighlightedExROptionId,
	);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const navigateToItem = (item: SearchItem) => {
		setRightPanelOpen(false);
		setSelectedTab(item.mode);

		if (item.mode === "ExR") {
			setSelectedExRTabId(item.tabId as ExRTabId);
			const { openedExRCategoryIds } = useStore.getState();
			if (!openedExRCategoryIds[item.categoryId]) {
				toggleExRCategory(item.categoryId);
			}

			if (item.type === "option" && item.uniqueOptionId) {
				const ancestors =
					exrOptionMetaData.options[item.uniqueOptionId]?.parentOptionIds ?? [];
				if (ancestors.length > 0) {
					openExROptions(ancestors);
				}
				setHighlightedExROptionId(item.uniqueOptionId);
				const navigateId = createExRNavigateId(item.uniqueOptionId);

				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
					setTimeout(() => setHighlightedExROptionId(null), 2000);
				}, 100);
			} else {
				// For categories, we might want to highlight the category header or just scroll to it
				const navigateId = `exr-category-${item.categoryId}`;
				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 100);
			}
		} else {
			setSelectedAuTabId(item.tabId);
			const { openedAuCategoryIds } = useStore.getState();
			if (!openedAuCategoryIds[item.categoryId]) {
				toggleAuCategory(item.categoryId);
			}

			if (item.type === "option" && typeof item.optionId === "number") {
				const auOptionId = item.optionId as AuOptionId;
				setHighlightedAuOptionId(auOptionId);
				const navigateId = createAuNavigateId(auOptionId);

				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
					setTimeout(() => setHighlightedAuOptionId(null), 2000);
				}, 100);
			} else {
				const navigateId = `au-category-${item.categoryId}`;
				setTimeout(() => {
					const element = document.getElementById(navigateId);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 100);
			}
		}
	};

	return navigateToItem;
}
