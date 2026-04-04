import { Accordion } from "../components/parts/Accordion";
import { ColoredText } from "../components/parts/ColoredText";
import { isPresetOption } from "../logics/optionUtils";
import type { ExRCategoryDto } from "../type";
import { useStore } from "../useStore";
import { ExRCategoryOptionList } from "./ExRCategoryOptionList";

interface ExRStandardCategoryItemProps {
	category: ExRCategoryDto;
}

/**
 * 全般タブなどで使用される標準的なカテゴリ表示コンポーネント
 */
export function ExRStandardCategoryItem({
	category,
}: ExRStandardCategoryItemProps) {
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[category.Id] ?? false;
	});
	const isPending = useStore((state) => {
		return (state.pendingCategoryCounts[category.Id] ?? 0) > 0;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const filteredOptions = category.Options.filter((option) => {
		return !isPresetOption(category.Id, option.Id);
	});

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<div
			data-testid={`exr-category-${category.Id}`}
			className={`relative transition-opacity duration-200 ${isPending ? "opacity-75" : "opacity-100"}`}
		>
			<Accordion
				title={<ColoredText text={category.Name} />}
				isOpen={isOpen}
				onToggle={() => {
					if (!isPending) {
						toggleExRCategory(category.Id);
					}
				}}
				headerExtra={
					isPending ? (
						<div className="flex items-center px-4">
							<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
						</div>
					) : undefined
				}
			>
				<div className={isPending ? "pointer-events-none grayscale-[0.5]" : ""}>
					<ExRCategoryOptionList
						categoryId={category.Id}
						options={filteredOptions}
					/>
				</div>
			</Accordion>
		</div>
	);
}
