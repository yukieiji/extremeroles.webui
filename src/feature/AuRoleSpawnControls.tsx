import { CompactSlider } from "../components/parts/CompactSlider";
import { auOptionMetaData } from "../logics/api";
import { findClosestIndex } from "../logics/optionUtils";
import { useStore } from "../useStore";

interface AuRoleSpawnControlsProps {
	categoryId: number;
}

/**
 * Auの役職のChanceとMaxCountをセットで管理するコンポーネント
 */
export function AuRoleSpawnControls({ categoryId }: AuRoleSpawnControlsProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];

	const chanceOptionId = categoryMeta?.options[0];
	const maxCountOptionId = categoryMeta?.options[1];

	const auValue = useStore((state) => state.auValue);
	const updateAuRoleOption = useStore((state) => state.updateAuRoleOption);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const isOpenedCategory = useStore(
		(state) => state.openedAuCategoryIds[categoryId] ?? false,
	);

	if (
		!categoryMeta ||
		chanceOptionId === undefined ||
		maxCountOptionId === undefined
	) {
		return null;
	}

	const chanceSelection = auValue[chanceOptionId] ?? 0;
	const maxCountSelection = auValue[maxCountOptionId] ?? 0;

	const chanceMeta = auOptionMetaData.options[chanceOptionId];
	const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

	const chanceValues = (chanceMeta?.range as number[]) ?? [];
	const maxCountValues = (maxCountMeta?.range as number[]) ?? [];

	const isChanceZero = (chanceValues[chanceSelection] ?? 0) === 0;
	const isMaxCountZero = (maxCountValues[maxCountSelection] ?? 0) === 0;

	const handleChanceChange = (newSelection: number) => {
		// Chanceが0%以外に変更されたとき、数が0なら1にあげる
		if (isMaxCountZero && (chanceValues[newSelection] ?? 0) > 0) {
			updateAuRoleOption(
				chanceOptionId,
				newSelection,
				maxCountOptionId,
				findClosestIndex(maxCountValues, 1),
			);
		} else if (chanceValues[newSelection] === 0) {
			// Chanceが0%になったら、スポーン数も0にしてアコーディオンを閉じる
			updateAuRoleOption(chanceOptionId, newSelection, maxCountOptionId, 0);
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		} else {
			updateAuRoleOption(
				chanceOptionId,
				newSelection,
				maxCountOptionId,
				maxCountSelection,
			);
		}
	};

	const handleChanceInputChange = (val: number) => {
		handleChanceChange(findClosestIndex(chanceValues, val));
	};

	const handleMaxCountChange = (newSelection: number) => {
		// 数が0以外に変更されたとき、現在Chanceが0%なら10%に上げる
		if (isChanceZero && (maxCountValues[newSelection] ?? 0) > 0) {
			updateAuRoleOption(
				chanceOptionId,
				findClosestIndex(chanceValues, 10),
				maxCountOptionId,
				newSelection,
			);
		} else if ((maxCountValues[newSelection] ?? 0) === 0) {
			// 数を0にすると、Chanceも0%にする
			updateAuRoleOption(
				chanceOptionId,
				findClosestIndex(chanceValues, 0),
				maxCountOptionId,
				newSelection,
			);
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		} else {
			updateAuRoleOption(
				chanceOptionId,
				chanceSelection,
				maxCountOptionId,
				newSelection,
			);
		}
	};

	const handleMaxCountInputChange = (val: number) => {
		handleMaxCountChange(findClosestIndex(maxCountValues, val));
	};

	return (
		<div className="flex items-center gap-4">
			<CompactSlider
				label="レート"
				values={chanceValues}
				currentSelection={chanceSelection}
				onSelectionChange={handleChanceChange}
				onInputChange={handleChanceInputChange}
				testId="au-chance-control"
			/>
			<CompactSlider
				label="数"
				values={maxCountValues}
				currentSelection={maxCountSelection}
				onSelectionChange={handleMaxCountChange}
				onInputChange={handleMaxCountInputChange}
				testId="au-max-count-control"
			/>
		</div>
	);
}
