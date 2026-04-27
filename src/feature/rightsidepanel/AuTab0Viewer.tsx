import { SidePanelAccordion } from "../../components/parts/SidePanelAccordion";
import { SidePanelMapCategory } from "../../components/parts/SidePanelMapCategory";
import { SidePanelOptionRow } from "../../components/parts/SidePanelOptionRow";
import { auOptionMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);

	const openedAuTab0CategoryIds = useStore(
		(state) => state.openedAuTab0CategoryIds,
	);
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

	// タブ0のカテゴリIDを取得
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	const handleDoubleClick = (categoryId: number, optionId: AuOptionId) => {
		// 1. メインタブをAuに切り替え、サイドバーと右パネルを閉じる
		setSelectedTab("Au");
		setRightPanelOpen(false);
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
		<div className="flex flex-col gap-1.5">
			{tab0CategoryIds.map((categoryId, index) => {
				const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
				if (!categoryMeta) {
					return null;
				}

				const isMapCategory = index === 0;

				if (isMapCategory) {
					return (
						<SidePanelMapCategory
							key={categoryId}
							categoryId={categoryId}
							handleDoubleClick={handleDoubleClick}
						/>
					);
				}

				return (
					<SidePanelAccordion
						key={categoryId}
						title={categoryMeta.name}
						isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
						onToggle={() => toggleAuTab0Category(categoryId)}
					>
						<div className="flex flex-col gap-0.5">
							{categoryMeta.options.map((optionId) => (
								<SidePanelOptionRow
									key={optionId}
									optionId={optionId}
									onDoubleClick={() => handleDoubleClick(categoryId, optionId)}
								/>
							))}
						</div>
					</SidePanelAccordion>
				);
			})}
		</div>
	);
}
