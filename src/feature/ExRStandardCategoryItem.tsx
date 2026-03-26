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
		return state.pendingCategoryIds[category.Id] ?? false;
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
			className="relative overflow-hidden"
		>
			<div
				className={`transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
			>
				<Accordion
					title={<ColoredText text={category.Name} />}
					isOpen={isOpen}
					onToggle={() => {
						toggleExRCategory(category.Id);
					}}
				>
					<ExRCategoryOptionList
						categoryId={category.Id}
						options={filteredOptions}
					/>
				</Accordion>
			</div>
			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
					<div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
