import { useCallback } from "react";
import { ColoredText } from "../components/parts/ColoredText";
import { exrOptionMetaData } from "../logics/api";
import {
	getOptionIdFromUniqueId,
	getUniqueOptionId,
	isPresetOption,
} from "../logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../type";
import { useStore } from "../useStore";
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

	const spawnRateValueData = useStore(
		useCallback(
			(state) => {
				return state.valueData[uniqueRateId];
			},
			[uniqueRateId],
		),
	);
	const spawnCountValueData = useStore(
		useCallback(
			(state) => {
				return state.valueData[uniqueCountId];
			},
			[uniqueCountId],
		),
	);

	const spawnRateSelection = spawnRateValueData?.selection ?? 0;
	const rateValues = (spawnRateValueData?.values as number[]) ?? [];
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;

	const isOpen = !isSpawnRateZero && (isOpendCategory ?? false);

	const optionIds = exrOptionMetaData.optionIdMap[categoryId] ?? [];

	const allPotentialOptionIds = optionIds.flatMap((optionId) => {
		if (isPresetOption(categoryId, optionId)) {
			return [];
		}
		if (
			optionId === SPAWN_RATE_OPTION_ID ||
			optionId === SPAWN_COUNT_OPTION_ID
		) {
			const uniqueId = getUniqueOptionId(
				selectedExRTabId,
				categoryId,
				optionId,
			);
			const childUniqueIds = exrOptionMetaData.childOptionMap[uniqueId] ?? [];
			return childUniqueIds.map((cid) => getOptionIdFromUniqueId(cid));
		}
		return [optionId];
	});

	// ID 50 と 51 を除外しつつ、重複（トップレベルと子要素の両方に存在する場合など）を排除
	const filteredOptionIds = allPotentialOptionIds.filter((id, index, self) => {
		if (id === SPAWN_RATE_OPTION_ID || id === SPAWN_COUNT_OPTION_ID) {
			return false;
		}
		return index === self.indexOf(id);
	});

	if (filteredOptionIds.length === 0) {
		return null;
	}

	const categoryName = exrOptionMetaData.categoryInfo[categoryId] ?? "";

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
						<ColoredText text={categoryName} />
					</span>
				</button>

				<div className="flex items-center px-4">
					{spawnRateValueData && spawnCountValueData && (
						<ExRRoleSpawnControls categoryId={categoryId} />
					)}
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
								optionIds={filteredOptionIds}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
