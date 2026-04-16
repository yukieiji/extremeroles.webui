import { use } from "react";
import { Accordion } from "../components/parts/Accordion";
import { ColoredText } from "../components/parts/ColoredText";
import { getExrCategoryOptions } from "../logics/api";
import { isPresetOption } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";
import { ExRCategoryOptionList } from "./ExRCategoryOptionList";

interface ExRStandardCategoryItemProps {
	categoryId: number;
}

/**
 * 全般タブなどで使用される標準的なカテゴリ表示コンポーネント
 */
export function ExRStandardCategoryItem({
	categoryId,
}: ExRStandardCategoryItemProps) {
	const category = use(getExrCategoryOptions(categoryId));
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});
	const isPending = useStore((state) => {
		return state.pendingExRCategoryIds[categoryId] ?? false;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});

	const filteredOptions = category.Options.filter((option: ExROptionDto) => {
		return !isPresetOption(categoryId, option.Id);
	});

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<div data-testid={`exr-category-${categoryId}`} className="relative">
			<Accordion
				title={
					<div className="flex items-center gap-2">
						<ColoredText text={category.Name} />
						{isPending && (
							<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
						)}
					</div>
				}
				isOpen={isOpen}
				onToggle={() => {
					toggleExRCategory(categoryId);
				}}
			>
				<ExRCategoryOptionList
					categoryId={categoryId}
					options={filteredOptions}
				/>
			</Accordion>
		</div>
	);
}
