import { RoleCategoryAccordion } from "../../components/blocks/RoleCategoryAccordion";
import { ColoredText } from "../../components/parts/ColoredText";
import { useOptionData } from "../../hooks/useExROptionData";
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
		<RoleCategoryAccordion
			isOpen={isOpen}
			onClick={() => toggleExRCategory(categoryId)}
			text={<ColoredText text={category} />}
			spawnControl={
				<ExRRoleSpawnControls
					tabId={selectedExRTabId}
					categoryId={categoryId}
				/>
			}
			disable={isSpawnRateZero}
		>
			<ExRCategoryOptionList
				categoryId={categoryId}
				uniqueOptionIds={filteredChildOptionIds}
			/>
		</RoleCategoryAccordion>
	);
}
