import { ColoredText } from "../components/parts/ColoredText";
import { isPresetOption } from "../logics/optionUtils";
import type { ExRCategoryDto } from "../type";
import { useStore } from "../useStore";
import { ExRCategoryOptionList } from "./ExRCategoryOptionList";
import { ExRRoleSpawnControls } from "./ExRRoleSpawnControls";

interface ExRRoleCategoryItemProps {
	category: ExRCategoryDto;
}

/**
 * 役職タブで使用される、スポーン設定をヘッダーに持つカテゴリ表示コンポーネント
 */
export function ExRRoleCategoryItem({ category }: ExRRoleCategoryItemProps) {
	const isOpendCategory = useStore((state) => {
		return state.openedExRCategoryIds[category.Id];
	});
	const isPending = useStore((state) => {
		return state.pendingCategoryIds[category.Id] ?? false;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const isOpen = isOpendCategory ?? false;

	const spawnRateOption = category.Options.find((opt) => {
		return opt.Id === 50;
	});
	const spawnCountOption = category.Options.find((opt) => {
		return opt.Id === 51;
	});

	const filteredOptions = category.Options.filter((option) => {
		if (isPresetOption(category.Id, option.Id)) {
			return false;
		}
		if (option.Id === 50 || option.Id === 51) {
			return false;
		}
		return true;
	});

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<div
			className="border border-gray-700 rounded-lg overflow-hidden mb-2 relative"
			data-testid={`exr-category-${category.Id}`}
		>
			<div
				className={`flex items-center bg-gray-800 hover:bg-gray-700 transition-all duration-200 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
			>
				<button
					type="button"
					onClick={() => {
						toggleExRCategory(category.Id);
					}}
					className="flex-1 flex items-center gap-3 p-4 text-left"
					aria-expanded={isOpen}
				>
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
					<span className="font-semibold text-gray-200">
						<ColoredText text={category.Name} />
					</span>
				</button>

				<div className="flex items-center px-4">
					{spawnRateOption && spawnCountOption && (
						<ExRRoleSpawnControls
							categoryId={category.Id}
							spawnRateOption={spawnRateOption}
							spawnCountOption={spawnCountOption}
						/>
					)}
				</div>
			</div>

			<div
				className={`grid transition-all duration-200 ease-in-out overflow-hidden ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				} ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
			>
				<div className="min-h-0">
					{isOpen && (
						<div className="p-4 bg-gray-900 border-t border-gray-700">
							<ExRCategoryOptionList
								categoryId={category.Id}
								options={filteredOptions}
							/>
						</div>
					)}
				</div>
			</div>

			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 pointer-events-none">
					<div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
