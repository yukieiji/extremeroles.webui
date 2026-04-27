import { auOptionMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";
import { AuMapCategory } from "./components/AuMapCategory";
import { AuStandardCategory } from "./components/AuStandardCategory";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);

	// タブ0のカテゴリIDを取得
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	const handleDoubleClick = (categoryId: number, optionId: AuOptionId) => {
		// 1. メインタブをAuに切り替え、サイドバーと右パネルを閉じる
		setSelectedTab("Au");
		setIsSidebarOpen(false);
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
		<div className="flex flex-col gap-1">
			{tab0CategoryIds.map((categoryId, index) => {
				const isMapCategory = index === 0;

				if (isMapCategory) {
					return (
						<AuMapCategory
							key={categoryId}
							categoryId={categoryId}
							onDoubleClick={handleDoubleClick}
						/>
					);
				}

				return (
					<AuStandardCategory
						key={categoryId}
						categoryId={categoryId}
						onDoubleClick={handleDoubleClick}
					/>
				);
			})}
		</div>
	);
}
