import { RoleCategoryAccordion } from "@/components/blocks/RoleCategoryAccordion";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { createAuNavigateId } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import { useStore } from "@/useStore";
import { AuCategoryOptionList } from "./AuCategoryOptionList";
import { AuRoleSpawnControls } from "./AuRoleSpawnControls";

interface AuRoleCategoryItemProps {
	categoryId: number;
}

/**
 * Auの役職タブ（Tab 1, 2）で使用される、スポーン設定をヘッダーに持つカテゴリ表示コンポーネント
 */
export function AuRoleCategoryItem({ categoryId }: AuRoleCategoryItemProps) {
	const isCategoryOpen = useStore(
		(state) => state.openedAuCategoryIds[categoryId] ?? false,
	);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);

	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];

	// 各カテゴリの最初(0)がChance、次(1)がMaxCount
	const chanceOptionId = categoryMeta?.options[0] ?? 0;
	const chanceValueIndex = useStore(
		(state) => state.auValue[chanceOptionId] ?? 0,
	);
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);

	const chanceOptionMeta = auOptionMetaData.options[chanceOptionId];

	// Chanceの実際の値（%）を取得
	const chanceActualValue = chanceOptionMeta?.range?.[chanceValueIndex] ?? 0;
	const isChanceZero = chanceActualValue === 0;

	const isOpen = !isChanceZero && isCategoryOpen;

	// 残りのオプション
	const otherOptionIds = categoryMeta.options.slice(2);

	const isHighlighted =
		highlightedAuOptionId !== null &&
		categoryMeta.options.includes(highlightedAuOptionId);

	const navigateId = createAuNavigateId(chanceOptionId);

	return (
		<div id={`au-category-${categoryId}`}>
			<HighlightWrapper
				id={navigateId}
				isHighlighted={isHighlighted}
				isInset={false}
			>
				<RoleCategoryAccordion
					isOpen={isOpen}
					onClick={() => toggleAuCategory(categoryId)}
					text={categoryMeta.name}
					spawnControl={<AuRoleSpawnControls categoryId={categoryId} />}
					disable={isChanceZero}
				>
					<AuCategoryOptionList optionIds={otherOptionIds} />
				</RoleCategoryAccordion>
			</HighlightWrapper>
		</div>
	);
}
