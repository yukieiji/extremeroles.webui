import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuCategoryOptionList } from "./AuCategoryOptionList";
import { AuRoleSpawnControls } from "./AuRoleSpawnControls";

interface AuRoleCategoryItemProps {
	categoryId: number;
}

/**
 * Auの役職タブ（Tab 1, 2）で使用される、スポーン設定をヘッダーに持つカテゴリ表示コンポーネント
 */
export function AuRoleCategoryItem({ categoryId }: AuRoleCategoryItemProps) {
	const isOpen = useStore(
		(state) => state.openedAuCategoryIds[categoryId] ?? false,
	);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const auValue = useStore((state) => state.auValue);

	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	if (!categoryMeta) {
		return null;
	}

	// 各カテゴリの最初(0)がChance、次(1)がMaxCount
	const chanceOptionId = categoryMeta.options[0];
	const chanceValueIndex = auValue[chanceOptionId] ?? 0;
	const chanceOptionMeta = auOptionMetaData.options[chanceOptionId];

	// Chanceの実際の値（%）を取得
	const chanceActualValue = chanceOptionMeta?.range?.[chanceValueIndex] ?? 0;
	const isChanceZero = chanceActualValue === 0;

	const isOpenFinal = !isChanceZero && isOpen;

	// 残りのオプション
	const otherOptionIds = categoryMeta.options.slice(2);

	return (
		<div
			className="border border-gray-700 rounded-lg overflow-hidden mb-2"
			data-testid={`au-category-${categoryId}`}
		>
			<div
				className={`flex items-center bg-gray-800 ${!isChanceZero ? "hover:bg-gray-700 transition-colors" : ""}`}
			>
				<button
					type="button"
					onClick={() => {
						if (!isChanceZero) {
							toggleAuCategory(categoryId);
						}
					}}
					className={`flex-1 flex items-center gap-3 p-4 text-left ${isChanceZero ? "cursor-default" : ""}`}
					aria-expanded={isOpenFinal}
					disabled={isChanceZero}
				>
					{isChanceZero ? (
						<div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">
							・
						</div>
					) : (
						<svg
							className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isOpenFinal ? "rotate-180" : ""}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>{isOpenFinal ? "Collapse" : "Expand"}</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					)}
					<span className="font-semibold text-gray-200">
						{categoryMeta.name}
					</span>
				</button>

				<div className="flex items-center px-4">
					<AuRoleSpawnControls categoryId={categoryId} />
				</div>
			</div>

			<div
				className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
					isOpenFinal ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="min-h-0">
					{isOpenFinal && otherOptionIds.length > 0 && (
						<div className="p-4 bg-gray-900 border-t border-gray-700">
							<AuCategoryOptionList optionIds={otherOptionIds} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
