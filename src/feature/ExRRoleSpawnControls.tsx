import { CompactSlider } from "../components/parts/CompactSlider";
import {
	findClosestIndex,
	getUniqueOptionId,
	useOptionData,
} from "../logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../type";
import { useStore } from "../useStore";

interface ExRRoleSpawnControlsProps {
	tabId: number;
	categoryId: number;
}

/**
 * 役職のスポーンレートとスポーン数をセットで管理し、同期させるためのコンポーネント
 */
export function ExRRoleSpawnControls({
	tabId,
	categoryId,
}: ExRRoleSpawnControlsProps) {
	const uniqueRateId = getUniqueOptionId(
		tabId,
		categoryId,
		SPAWN_RATE_OPTION_ID,
	);
	const uniqueCountId = getUniqueOptionId(
		tabId,
		categoryId,
		SPAWN_COUNT_OPTION_ID,
	);

	const effectiveSpawnRateSelection = useStore((state) => {
		return state.effectiveSelections[uniqueRateId];
	});

	const effectiveSpawnCountSelection = useStore((state) => {
		return state.effectiveSelections[uniqueCountId];
	});

	const TEMP_updateExROptionSelection = useStore((state) => {
		return state.TEMP_updateExROptionSelection;
	});
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});
	const isOpenedCategory = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});

	const spawnRateOption = useOptionData(uniqueRateId);
	const spawnCountOption = useOptionData(uniqueCountId);

	const spawnRateSelection =
		effectiveSpawnRateSelection ?? spawnRateOption?.selection ?? 0;
	const spawnCountSelection =
		effectiveSpawnCountSelection ?? spawnCountOption?.selection ?? 0;

	const rateValues = spawnRateOption?.values as number[] ?? [];
	const originalCountValues = spawnCountOption?.values as number[] ?? [];

	// スポーン数が0をサポートするための仮想的な値リスト
	const virtualCountValues = [0, ...originalCountValues];

	// 現在のスポーンレートが0%なら、表示上のスポーン数も強制的に0
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;
	const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

	const handleRateChange = (newSelection: number) => {
		TEMP_updateExROptionSelection(uniqueRateId, newSelection);

		// スポーンレートが0%なら、スポーン数も0としてリセット
		if (rateValues[newSelection] === 0) {
			TEMP_updateExROptionSelection(uniqueCountId, 0);
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
			TEMP_updateExROptionSelection(
				uniqueRateId,
				findClosestIndex(rateValues, 0),
			);
			TEMP_updateExROptionSelection(uniqueCountId, 0);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		} else {
			// 数が0以外に変更されたとき、現在レートが0%なら10%に上げる
			if (isSpawnRateZero) {
				TEMP_updateExROptionSelection(
					uniqueRateId,
					findClosestIndex(rateValues, 10),
				);
			}
			TEMP_updateExROptionSelection(uniqueCountId, newUISelection - 1);
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
