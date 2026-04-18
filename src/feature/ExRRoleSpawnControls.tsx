import { CompactSlider } from "../components/parts/CompactSlider";
import { findClosestIndex, getUniqueOptionId } from "../logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../type";
import { useStore } from "../useStore";

interface ExRRoleSpawnControlsProps {
	categoryId: number;
}

/**
 * 役職のスポーンレートとスポーン数をセットで管理し、同期させるためのコンポーネント
 */
export function ExRRoleSpawnControls({ categoryId }: ExRRoleSpawnControlsProps) {
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

	const spawnRateValueData = useStore((state) => {
		return state.valueData[uniqueRateId];
	});

	const spawnCountValueData = useStore((state) => {
		return state.valueData[uniqueCountId];
	});

	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});
	const isOpenedCategory = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});

	const spawnRateSelection = spawnRateValueData?.selection ?? 0;
	const spawnCountSelection = spawnCountValueData?.selection ?? 0;

	const rateValues = (spawnRateValueData?.values as number[]) ?? [];
	const originalCountValues = (spawnCountValueData?.values as number[]) ?? [];

	// スポーン数が0をサポートするための仮想的な値リスト
	const virtualCountValues = [0, ...originalCountValues];

	// 現在のスポーンレートが0%なら、表示上のスポーン数も強制的に0
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;
	const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

	const handleRateChange = (newSelection: number) => {
		updateExROptionSelection(uniqueRateId, newSelection);

		// スポーンレートが0%なら、スポーン数も0としてリセット
		if (rateValues[newSelection] === 0) {
			updateExROptionSelection(uniqueCountId, 0);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		}
	};

	const handleRateInputChange = (val: number) => {
		handleRateChange(findClosestIndex(rateValues, val));
	};

	const handleCountUIChange = (newUISelection: number) => {
		if (newUISelection === 0) {
			// 数を0にすると、レートも0%にする
			updateExROptionSelection(
				uniqueRateId,
				findClosestIndex(rateValues, 0),
			);
			updateExROptionSelection(uniqueCountId, 0);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		} else {
			// 数が0以外に変更されたとき、現在レートが0%なら10%に上げる
			if (isSpawnRateZero) {
				updateExROptionSelection(
					uniqueRateId,
					findClosestIndex(rateValues, 10),
				);
			}
			updateExROptionSelection(uniqueCountId, newUISelection - 1);
		}
	};

	const handleCountUIInputChange = (val: number) => {
		handleCountUIChange(findClosestIndex(virtualCountValues, val));
	};

	return (
		<div className="flex items-center gap-4">
			<CompactSlider
				label="レート"
				values={rateValues}
				currentSelection={spawnRateSelection}
				onSelectionChange={handleRateChange}
				onInputChange={handleRateInputChange}
				testId="spawn-rate-control"
			/>
			<CompactSlider
				label="数"
				values={virtualCountValues}
				currentSelection={currentCountUISelection}
				onSelectionChange={handleCountUIChange}
				onInputChange={handleCountUIInputChange}
				testId="spawn-count-control"
			/>
		</div>
	);
}
