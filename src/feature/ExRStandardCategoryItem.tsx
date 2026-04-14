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
	// データ更新時に再レンダリングを強制するため、exrVersionを監視する
	useStore((state) => state.exrVersion);
	const category = use(getExrCategoryOptions(categoryId));
	const isOpen = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
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
		<div data-testid={`exr-category-${categoryId}`}>
			<Accordion
				title={<ColoredText text={category.Name} />}
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
