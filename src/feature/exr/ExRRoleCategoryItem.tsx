import { RoleCategoryAccordion } from "@/components/blocks/RoleCategoryAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { TYPOGRAPHY } from "@/designConstants";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRCategoryNavigateId } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId } from "@/logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "@/type";
import { useStore } from "@/useStore";
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
	const highlightedExRCategoryId = useStore(
		(state) => state.highlightedExRCategoryId,
	);

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

	const categoryMeta = exrOptionMetaData.categories[categoryId];
	const category = categoryMeta?.name ?? "";
	const categoryColors = categoryMeta?.categoryColors ?? [];

	const inactiveOptionDisplay = useStore(
		(state) => state.appSetting?.inactiveOptionDisplay ?? "hidden",
	);
	const spawnRateSelection = spawnRateOptionValue.selection ?? 0;
	const isSpawnRateZero = spawnRateSelection === 0;
	const isRoleActive = !isSpawnRateZero;
	const isOpen =
		(isRoleActive || inactiveOptionDisplay !== "hidden") &&
		(isOpendCategory ?? false);

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

	const isHighlighted = highlightedExRCategoryId === categoryId;
	const navigateId = createExRCategoryNavigateId(categoryId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<RoleCategoryAccordion
				isOpen={isOpen}
				onClick={() => toggleExRCategory(categoryId)}
				text={<ColoredText text={category} className={TYPOGRAPHY.LABEL} />}
				spawnControl={
					<ExRRoleSpawnControls
						tabId={selectedExRTabId}
						categoryId={categoryId}
					/>
				}
				disable={isSpawnRateZero && inactiveOptionDisplay === "hidden"}
				headerColors={categoryColors}
			>
				<ExRCategoryOptionList
					categoryId={categoryId}
					uniqueOptionIds={filteredChildOptionIds}
				/>
			</RoleCategoryAccordion>
		</HighlightWrapper>
	);
}
