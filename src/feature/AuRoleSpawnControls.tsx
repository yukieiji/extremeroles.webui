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
	const updateAuOptionSelection = useStore(
		(state) => state.updateAuOptionSelection,
	);
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

	const handleChanceChange = (newSelection: number) => {
		updateAuOptionSelection({
			auOptionId: chanceOptionId,
			selection: newSelection,
		});

		// Chanceが0%になったら、アコーディオンを閉じる
		if (chanceValues[newSelection] === 0) {
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		}
	};

	const handleChanceInputChange = (val: number) => {
		handleChanceChange(findClosestIndex(chanceValues, val));
	};

	const handleMaxCountChange = (newSelection: number) => {
		// 数が0以外に変更されたとき、現在Chanceが0%なら10%に上げる
		if ((maxCountValues[newSelection] ?? 0) > 0 && isChanceZero) {
			updateAuOptionSelection(
				{
					auOptionId: chanceOptionId,
					selection: findClosestIndex(chanceValues, 10),
				},
				{
					auOptionId: maxCountOptionId,
					selection: newSelection,
				},
			);
		} else if ((maxCountValues[newSelection] ?? 0) === 0) {
			// 数を0にすると、Chanceも0%にする
			updateAuOptionSelection(
				{
					auOptionId: chanceOptionId,
					selection: findClosestIndex(chanceValues, 0),
				},
				{
					auOptionId: maxCountOptionId,
					selection: newSelection,
				},
			);
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		} else {
			updateAuOptionSelection({
				auOptionId: maxCountOptionId,
				selection: newSelection,
			});
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
