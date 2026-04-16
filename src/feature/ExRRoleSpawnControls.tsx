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
	const spawnRateSelection = spawnRateOption.Selection;
	const spawnCountSelection = spawnCountOption.Selection;

	const updateExROptionSelection = useStore((state) => {
		return state.updateExROptionSelection;
	});

	const rateValues = spawnRateOption.RangeMeta.Values as number[];
	const originalCountValues = spawnCountOption.RangeMeta.Values as number[];

	// スポーン数が0をサポートするための仮想的な値リスト
	const virtualCountValues = [0, ...originalCountValues];

	// 現在のスポーンレートが0%なら、表示上のスポーン数も強制的に0
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;
	const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

	const handleRateChange = (newSelection: number) => {
		const uniqueId = getUniqueOptionId(categoryId, spawnRateOption.Id);
		updateExROptionSelection(uniqueId, newSelection);
	};

	const handleRateInputChange = (val: number) => {
		handleRateChange(findClosestIndex(rateValues, val));
	};

	const handleCountUIChange = (newUISelection: number) => {
		const uniqueId = getUniqueOptionId(categoryId, spawnCountOption.Id);
		// 表示上の値から内部のインデックスへ変換するロジックは呼び出し側にある
		updateExROptionSelection(uniqueId, newUISelection);
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
