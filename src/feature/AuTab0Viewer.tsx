import { use } from "react";
import { Accordion } from "../components/parts/Accordion";
import { ColoredText } from "../components/parts/ColoredText";
import { OptionFormat } from "../components/parts/OptionFormat";
import { auOptionMetaData, translationMetaData } from "../logics/api";
import { getAllOptions } from "../logics/api.store";
import type { AuOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	use(getAllOptions());

	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);
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
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

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
		<div className="flex flex-col gap-2">
			{tab0CategoryIds.map((categoryId, index) => {
				const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
				if (!categoryMeta) {
					return null;
				}

				const isMapCategory = index === 0;

				if (isMapCategory) {
					const mapOptionId = categoryMeta.options[0];
					const [_, ...otherOptionIds] = categoryMeta.options;
					const mapOptionMeta = auOptionMetaData.options[mapOptionId];

					if (!mapOptionMeta) {
						return null;
					}

					const mapValue = mapOptionMeta.range[auValue[mapOptionId] ?? 0];

					return (
						<div
							key={categoryId}
							className="border border-gray-700 rounded-lg overflow-hidden mb-2"
						>
							<button
								type="button"
								data-testid={`right-panel-option-${mapOptionId}`}
								onDoubleClick={() => handleDoubleClick(categoryId, mapOptionId)}
								className="w-full flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="w-5 h-5" />
									<span className="font-semibold text-gray-200 text-sm">
										{mapOptionMeta.title}
									</span>
								</div>
								<span className="text-sm text-blue-400 font-medium">
									{mapValue.toString()}
								</span>
							</button>
							{otherOptionIds.length > 0 && (
								<div className="p-4 bg-gray-900 space-y-1">
									{otherOptionIds.map((optionId) => {
										const optionMeta = auOptionMetaData.options[optionId];
										const selection = auValue[optionId] ?? 0;
										if (!optionMeta) {
											return null;
										}
										const value = optionMeta.range[selection];
										const isBoolean = typeof value === "boolean";

										return (
											<button
												type="button"
												key={optionId}
												data-testid={`right-panel-option-${optionId}`}
												onDoubleClick={() =>
													handleDoubleClick(categoryId, optionId)
												}
												className="w-full flex justify-between items-center py-1 px-2 hover:bg-gray-700/50 rounded cursor-pointer select-none gap-2"
												title="ダブルクリックで設定場所へ移動"
											>
												<span className="text-xs text-gray-300 truncate flex-1 text-left">
													{optionMeta.title}
												</span>
												<div className="flex items-center gap-1 shrink-0">
													<span className="text-xs text-blue-400 font-medium text-right">
														{isBoolean ? (
															<ColoredText
																text={
																	translationMetaData.booleanTransData[
																		value ? 1 : 0
																	] || (value ? "ON" : "OFF")
																}
															/>
														) : (
															value.toString()
														)}
													</span>
													{!isBoolean && (
														<div className="text-[10px] scale-90 origin-right">
															<OptionFormat format={optionMeta.format} />
														</div>
													)}
												</div>
											</button>
										);
									})}
								</div>
							)}
						</div>
					);
				}

				return (
					<Accordion
						key={categoryId}
						title={<span className="text-sm">{categoryMeta.name}</span>}
						isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
						onToggle={() => toggleAuTab0Category(categoryId)}
					>
						<div className="flex flex-col gap-1">
							{categoryMeta.options.map((optionId) => {
								const optionMeta = auOptionMetaData.options[optionId];
								const selection = auValue[optionId] ?? 0;
								if (!optionMeta) {
									return null;
								}

								const value = optionMeta.range[selection];
								const isBoolean = typeof value === "boolean";

								return (
									<button
										type="button"
										key={optionId}
										data-testid={`right-panel-option-${optionId}`}
										onDoubleClick={() =>
											handleDoubleClick(categoryId, optionId)
										}
										className="w-full flex justify-between items-center py-1 px-2 hover:bg-gray-700/50 rounded cursor-pointer select-none gap-2"
										title="ダブルクリックで設定場所へ移動"
									>
										<span className="text-xs text-gray-300 truncate flex-1 text-left">
											{optionMeta.title}
										</span>
										<div className="flex items-center gap-1 shrink-0">
											<span className="text-xs text-blue-400 font-medium text-right">
												{isBoolean ? (
													<ColoredText
														text={
															translationMetaData.booleanTransData[
																value ? 1 : 0
															] || (value ? "ON" : "OFF")
														}
													/>
												) : (
													value.toString()
												)}
											</span>
											{!isBoolean && (
												<div className="text-[10px] scale-90 origin-right">
													<OptionFormat format={optionMeta.format} />
												</div>
											)}
										</div>
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
