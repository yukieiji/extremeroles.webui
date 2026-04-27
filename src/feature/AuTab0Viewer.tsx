import { useEffect } from "react";
import { Accordion } from "../components/parts/Accordion";
import { auOptionMetaData, translationMetaData } from "../logics/api";
import type { AuOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const auValue = useStore((state) => state.auValue);

	const openedAuTab0CategoryIds = useStore(
		(state) => state.openedAuTab0CategoryIds,
	);
	const setOpenedAuTab0CategoryIds = useStore(
		(state) => state.setOpenedAuTab0CategoryIds,
	);
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

	// 初期表示時に全てのカテゴリを開く
	useEffect(() => {
		const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];
		const initial: Record<number, boolean> = {};
		for (const id of tab0CategoryIds) {
			initial[id] = true;
		}
		setOpenedAuTab0CategoryIds(initial);
	}, [setOpenedAuTab0CategoryIds]);

	// タブ0のカテゴリIDを取得
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	const handleDoubleClick = (categoryId: number, optionId: AuOptionId) => {
		// 1. メインタブをAuに切り替え
		setSelectedTab("Au");
		// 2. Auタブを0に切り替え
		setSelectedAuTabId(0);
		// 3. カテゴリを確実に開く
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}

		// 4. ハイライト設定
		setHighlightedAuOptionId(optionId);

		// 5. 少し遅らせてスクロール（DOMのレンダリング待ち）
		setTimeout(() => {
			const element = document.getElementById(`au-option-${optionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			// 2秒後にハイライトを消す
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return (
		<div className="flex flex-col gap-2">
			{tab0CategoryIds.map((categoryId) => {
				const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
				if (!categoryMeta) {
					return null;
				}

				return (
					<Accordion
						key={categoryId}
						title={<span className="text-sm">{categoryMeta.name}</span>}
						isOpen={openedAuTab0CategoryIds[categoryId] ?? false}
						onToggle={() => toggleAuTab0Category(categoryId)}
					>
						<div className="flex flex-col gap-1">
							{categoryMeta.options.map((optionId) => {
								const optionMeta = auOptionMetaData.options[optionId];
								const selection = auValue[optionId] ?? 0;
								if (!optionMeta) {
									return null;
								}

								let valueDisplay = "";
								const value = optionMeta.range[selection];
								if (typeof value === "boolean") {
									valueDisplay =
										translationMetaData.booleanTransData[value ? 1 : 0] ||
										(value ? "ON" : "OFF");
								} else {
									valueDisplay = optionMeta.format.replace(
										"{0}",
										value.toString(),
									);
								}

								return (
									<button
										type="button"
										key={optionId}
										onDoubleClick={() =>
											handleDoubleClick(categoryId, optionId)
										}
										className="w-full flex justify-between items-center py-1 px-2 hover:bg-gray-700/50 rounded cursor-pointer select-none"
										title="ダブルクリックで設定場所へ移動"
									>
										<span className="text-xs text-gray-300">
											{optionMeta.title}
										</span>
										<span className="text-xs text-blue-400 font-medium text-right">
											{valueDisplay}
										</span>
									</button>
								);
							})}
						</div>
					</Accordion>
				);
			})}
		</div>
	);
}
