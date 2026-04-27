import { ColoredText } from "../../components/parts/ColoredText";
import { useOptionData } from "../../hooks/useOptionData";
import { exrOptionMetaData } from "../../logics/api";
import { getUniqueOptionId } from "../../logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../../type";
import { useStore } from "../../useStore";
import { ExRCategoryOptionList } from "./ExRCategoryOptionList";
import { ExRRoleSpawnControls } from "./ExRRoleSpawnControls";

interface ExRRoleCategoryItemProps {
	categoryId: number;
}

/**
 * 役職タブで使用される、スポーン設定をヘッダーに持つカテゴリ表示コンポーネント
 */
export function ExRRoleCategoryItem({ categoryId }: ExRRoleCategoryItemProps) {
	const isOpendCategory = useStore((state) => {
		return state.openedExRCategoryIds[categoryId];
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});

	const uniqueRateId = getUniqueOptionId(
		selectedExRTabId,
		categoryId,
		SPAWN_RATE_OPTION_ID,
	);
	const uniqueCountId = getUniqueOptionId(
		selectedExRTabId,
		categoryId,
		SPAWN_COUNT_OPTION_ID,
	);
	const spawnRateOptionValue = useOptionData(uniqueRateId);

	const category = exrOptionMetaData.categories[categoryId]?.name ?? "";

	const spawnRateSelection = spawnRateOptionValue.selection ?? 0;
	const isSpawnRateZero = spawnRateSelection === 0;
	const isOpen = !isSpawnRateZero && (isOpendCategory ?? false);

	// 役職のオプションは、トップレベルのスポーンレートが一つ合って、その下に各種オプションがぶら下がる構造になっている
	// 50
	// ├─ 51
	// ├─ 1
	// └─ 4
	// なので、スポーンレートのオプションIDの子要素を取れば、その役職の全オプションを取得できる
	const childUniqueOptionIds =
		exrOptionMetaData.options[uniqueRateId]?.childOptionIds || [];
	// スポーン数のオプションはスポーンレートの子であることが確定、孫とかにはない
	const filteredChildOptionIds = childUniqueOptionIds.filter((optionId) => {
		return optionId !== uniqueCountId;
	});

	if (filteredChildOptionIds.length === 0) {
		return null;
	}

	return (
		<div
			className="border border-gray-700 rounded-lg overflow-hidden mb-2"
			data-testid={`exr-category-${categoryId}`}
		>
			<div
				className={`flex items-center bg-gray-800 ${!isSpawnRateZero ? "hover:bg-gray-700 transition-colors" : ""}`}
			>
				<button
					type="button"
					onClick={() => {
						if (!isSpawnRateZero) {
							toggleExRCategory(categoryId);
						}
					}}
					className={`flex-1 flex items-center gap-3 p-4 text-left ${isSpawnRateZero ? "cursor-default" : ""}`}
					aria-expanded={isOpen}
					disabled={isSpawnRateZero}
				>
					{isSpawnRateZero ? (
						<div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">
							・
						</div>
					) : (
						<svg
							className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-180" : ""}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>{isOpen ? "Collapse" : "Expand"}</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					)}
					<span className="font-semibold text-gray-200">
						<ColoredText text={category} />
					</span>
				</button>

				<div className="flex items-center px-4">
					<ExRRoleSpawnControls
						tabId={selectedExRTabId}
						categoryId={categoryId}
					/>
				</div>
			</div>

			<div
				className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="min-h-0">
					{isOpen && (
						<div className="p-4 bg-gray-900 border-t border-gray-700">
							<ExRCategoryOptionList
								categoryId={categoryId}
								uniqueOptionIds={filteredChildOptionIds}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
