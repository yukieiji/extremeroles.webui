import { use } from "react";
import { ColoredText } from "../components/parts/ColoredText";
import { getExrCategoryOptions } from "../logics/api";
import { isPresetOption } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
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
	const category = use(getExrCategoryOptions(categoryId));
	const isOpendCategory = useStore((state) => {
		return state.openedExRCategoryIds[categoryId];
	});
	const isPending = useStore((state) => {
		return state.pendingExRCategoryIds[categoryId] ?? false;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const spawnRateOption = category.Options.find((opt: ExROptionDto) => {
		return opt.Id === 50;
	});
	const spawnCountOption = category.Options.find((opt: ExROptionDto) => {
		return opt.Id === 51;
	});

	const spawnRateSelection = spawnRateOption?.Selection ?? 0;
	const rateValues = (spawnRateOption?.RangeMeta.Values as number[]) ?? [];
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;

	const isOpen = !isSpawnRateZero && (isOpendCategory ?? false);

	const allPotentialOptions = category.Options.flatMap(
		(option: ExROptionDto) => {
			if (isPresetOption(categoryId, option.Id)) {
				return [];
			}
			if (option.Id === 50 || option.Id === 51) {
				return option.Childs || [];
			}
			return [option];
		},
	);

	// ID 50 と 51 を除外しつつ、重複（トップレベルと子要素の両方に存在する場合など）を排除
	const filteredOptions = (allPotentialOptions as ExROptionDto[]).filter(
		(option, index, self) => {
			if (option.Id === 50 || option.Id === 51) {
				return false;
			}
			return (
				index ===
				self.findIndex((o) => {
					return o.Id === option.Id;
				})
			);
		},
	);

	if (filteredOptions.length === 0) {
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
					<span className="font-semibold text-gray-200 flex items-center gap-2">
						<ColoredText text={category.Name} />
						{isPending && (
							<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
						)}
					</span>
				</button>

				<div className="flex items-center px-4">
					{spawnRateOption && spawnCountOption && (
						<ExRRoleSpawnControls
							categoryId={categoryId}
							spawnRateOption={spawnRateOption}
							spawnCountOption={spawnCountOption}
						/>
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
								options={filteredOptions}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
