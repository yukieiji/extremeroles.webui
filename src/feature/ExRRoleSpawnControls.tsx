import { CompactSlider } from "../components/parts/CompactSlider";
import { findClosestIndex, getUniqueOptionId } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";

interface ExRRoleSpawnControlsProps {
	categoryId: number;
	spawnRateOption: ExROptionDto;
	spawnCountOption: ExROptionDto;
}

/**
 * 役職のスポーンレートとスポーン数をセットで管理し、同期させるためのコンポーネント
 */
export function ExRRoleSpawnControls({
	categoryId,
	spawnRateOption,
	spawnCountOption,
}: ExRRoleSpawnControlsProps) {
	const uniqueRateId = getUniqueOptionId(categoryId, 50);
	const uniqueCountId = getUniqueOptionId(categoryId, 51);

	const effectiveSpawnRateSelection = useStore((state) => {
		return state.effectiveSelections[uniqueRateId];
	});

	const effectiveSpawnCountSelection = useStore((state) => {
		return state.effectiveSelections[uniqueCountId];
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

	const spawnRateSelection =
		effectiveSpawnRateSelection ?? spawnRateOption.Selection;
	const spawnCountSelection =
		effectiveSpawnCountSelection ?? spawnCountOption.Selection;

	const rateValues = spawnRateOption.RangeMeta.Values as number[];
	const originalCountValues = spawnCountOption.RangeMeta.Values as number[];

	// スポーン数が0をサポートするための仮想的な値リスト
	const virtualCountValues = [0, ...originalCountValues];

	// 現在のスポーンレートが0%なら、表示上のスポーン数も強制的に0
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;
	const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

	const handleRateChange = async (newSelection: number) => {
		// スポーンレートが0%なら、スポーン数も0としてリセット
		if (rateValues[newSelection] === 0) {
			await updateExROptionSelection(uniqueRateId, newSelection);
			await updateExROptionSelection(uniqueCountId, 0);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		} else {
			await updateExROptionSelection(uniqueRateId, newSelection);
		}
	};

	const handleRateInputChange = async (val: number) => {
		await handleRateChange(findClosestIndex(rateValues, val));
	};

	const handleCountUIChange = async (newUISelection: number) => {
		if (newUISelection === 0) {
			// 数を0にすると、レートも0%にする
			await updateExROptionSelection(
				uniqueRateId,
				findClosestIndex(rateValues, 0),
			);
			await updateExROptionSelection(uniqueCountId, 0);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		} else {
			// 数が0以外に変更されたとき、現在レートが0%なら10%に上げる
			if (isSpawnRateZero) {
				await updateExROptionSelection(
					uniqueRateId,
					findClosestIndex(rateValues, 10),
				);
			}
			await updateExROptionSelection(uniqueCountId, newUISelection - 1);
		}
	};

	const handleCountUIInputChange = async (val: number) => {
		await handleCountUIChange(findClosestIndex(virtualCountValues, val));
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
