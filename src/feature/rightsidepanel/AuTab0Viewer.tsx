import { ColoredText } from "../../components/parts/ColoredText";
import { OptionFormat } from "../../components/parts/OptionFormat";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { auOptionMetaData, translationMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	return (
		<div className="flex flex-col gap-1">
			{tab0CategoryIds.map((categoryId, index) => {
				const isMapCategory = index === 0;
				if (isMapCategory) {
					return <AuTab0MapCategory key={categoryId} categoryId={categoryId} />;
				}
				return (
					<AuTab0GeneralCategory key={categoryId} categoryId={categoryId} />
				);
			})}
		</div>
	);
}

/**
 * 各設定項目の行コンポーネント
 */
function AuTab0OptionRow({
	optionId,
	categoryId,
}: { optionId: AuOptionId; categoryId: number }) {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const auValue = useStore((state) => state.auValue);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const optionMeta = auOptionMetaData.options[optionId];
	if (!optionMeta) return null;

	const selection = auValue[optionId] ?? 0;
	const value = optionMeta.range[selection];
	const isBoolean = typeof value === "boolean";

	const handleDoubleClick = () => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(0);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		setTimeout(() => {
			const element = document.getElementById(`au-option-${optionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	const valueDisplay = (
		<div className="flex items-center gap-1 shrink-0">
			<span className="text-xs text-blue-400 font-medium text-right">
				{isBoolean ? (
					<ColoredText
						text={
							translationMetaData.booleanTransData[value ? 1 : 0] ||
							(value ? "ON" : "OFF")
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
	);

	return (
		<ViewerOptionRow
			title={optionMeta.title}
			value={valueDisplay}
			onDoubleClick={handleDoubleClick}
			testId={`right-panel-option-${optionId}`}
		/>
	);
}

/**
 * Map用カテゴリコンポーネント (最初の項目がヘッダーに統合される)
 */
function AuTab0MapCategory({ categoryId }: { categoryId: number }) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const auValue = useStore((state) => state.auValue);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);

	if (!categoryMeta) return null;

	const mapOptionId = categoryMeta.options[0];
	const otherOptionIds = categoryMeta.options.slice(1);
	const mapOptionMeta = auOptionMetaData.options[mapOptionId];

	if (!mapOptionMeta) return null;

	const mapValue = mapOptionMeta.range[auValue[mapOptionId] ?? 0];

	const handleHeaderDoubleClick = () => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(0);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(mapOptionId);

		setTimeout(() => {
			const element = document.getElementById(`au-option-${mapOptionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-1">
			<button
				type="button"
				data-testid={`right-panel-option-${mapOptionId}`}
				onDoubleClick={handleHeaderDoubleClick}
				className="w-full flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
			>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4" />
					<span className="font-semibold text-gray-200 text-sm">
						{mapOptionMeta.title}
					</span>
				</div>
				<span className="text-sm text-blue-400 font-medium">
					{mapValue.toString()}
				</span>
			</button>
			{otherOptionIds.length > 0 && (
				<div className="p-1 bg-gray-900 space-y-0.5">
					{otherOptionIds.map((optionId) => (
						<AuTab0OptionRow
							key={optionId}
							optionId={optionId}
							categoryId={categoryId}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * 一般カテゴリコンポーネント
 */
function AuTab0GeneralCategory({ categoryId }: { categoryId: number }) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const openedAuTab0CategoryIds = useStore(
		(state) => state.openedAuTab0CategoryIds,
	);
	const toggleAuTab0Category = useStore((state) => state.toggleAuTab0Category);

	if (!categoryMeta) return null;

	return (
		<CompactAccordion
			title={<span className="text-sm">{categoryMeta.name}</span>}
			isOpen={openedAuTab0CategoryIds[categoryId] ?? true}
			onToggle={() => toggleAuTab0Category(categoryId)}
		>
			<div className="flex flex-col gap-0.5">
				{categoryMeta.options.map((optionId) => (
					<AuTab0OptionRow
						key={optionId}
						optionId={optionId}
						categoryId={categoryId}
					/>
				))}
			</div>
		</CompactAccordion>
	);
}
