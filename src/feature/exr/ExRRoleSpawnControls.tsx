import { RoleSpawnControls } from "../../components/blocks/RoleSpawnControls";
import { useOptionData } from "../../hooks/useExROptionData";
import { useUpdateExROptionSelection } from "../../logics/api.store";
import { findClosestIndex, getUniqueOptionId } from "../../logics/optionUtils";
import { SPAWN_COUNT_OPTION_ID, SPAWN_RATE_OPTION_ID } from "../../type";
import { useStore } from "../../useStore";

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

	const updateExROptionSelection = useUpdateExROptionSelection();
	const toggleExRCategory = useStore((state) => {
		return state.toggleExRCategory;
	});
	const isOpenedCategory = useStore((state) => {
		return state.openedExRCategoryIds[categoryId] ?? false;
	});

	const spawnRateOption = useOptionData(uniqueRateId);
	const spawnCountOption = useOptionData(uniqueCountId);

	const spawnRateSelection = spawnRateOption?.selection ?? 0;
	const spawnCountSelection = spawnCountOption?.selection ?? 0;

	const rateValues = (spawnRateOption?.values as number[]) ?? [];
	const originalCountValues = (spawnCountOption?.values as number[]) ?? [];

	// スポーン数が0をサポートするための仮想的な値リスト
	const virtualCountValues = [0, ...originalCountValues];

	// 現在のスポーンレートが0%なら、表示上のスポーン数も強制的に0
	const isSpawnRateZero = rateValues[spawnRateSelection] === 0;
	const currentCountUISelection = isSpawnRateZero ? 0 : spawnCountSelection + 1;

	const handleRateChange = async (newSelection: number) => {
		const isBecomingEnabled = isSpawnRateZero && rateValues[newSelection] > 0;

		await updateExROptionSelection({
			uniqueOptionId: uniqueRateId,
			selection: newSelection,
		});

		// スポーンレートが0%なら、スポーン数も0としてリセット
		if (rateValues[newSelection] === 0) {
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		}

		if (isBecomingEnabled && !isOpenedCategory) {
			toggleExRCategory(categoryId);
		}
	};

	const handleRateInputChange = async (val: number) => {
		await handleRateChange(findClosestIndex(rateValues, val));
	};

	const handleCountUIChange = async (newUISelection: number) => {
		const isBecomingEnabled = isSpawnRateZero && newUISelection > 0;

		if (newUISelection === 0) {
			// 数を0にすると、レートも0%にする
			await updateExROptionSelection(
				{
					uniqueOptionId: uniqueRateId,
					selection: findClosestIndex(rateValues, 0),
				},
				{ uniqueOptionId: uniqueCountId, selection: 1 }, // 表示上は0だけど、実際の選択肢は1（最小値）にする
			);
			if (isOpenedCategory) {
				toggleExRCategory(categoryId);
			}
		} else {
			// 数が0以外に変更されたとき、現在レートが0%なら10%に上げる
			const updateArg = {
				uniqueOptionId: uniqueCountId,
				selection: newUISelection - 1,
			};
			if (isSpawnRateZero) {
				await updateExROptionSelection(
					{
						uniqueOptionId: uniqueRateId,
						selection: findClosestIndex(rateValues, 10),
					},
					updateArg,
				);
			} else {
				await updateExROptionSelection(updateArg);
			}
		}

		if (isBecomingEnabled && !isOpenedCategory) {
			toggleExRCategory(categoryId);
		}
	};

	const handleCountUIInputChange = async (val: number) => {
		await handleCountUIChange(findClosestIndex(virtualCountValues, val));
	};

	return (
		<RoleSpawnControls
			rate={{
				values: rateValues,
				currentSelection: spawnRateSelection,
				onSelectionChange: handleRateChange,
				onInputChange: handleRateInputChange,
			}}
			num={{
				values: virtualCountValues,
				currentSelection: currentCountUISelection,
				onSelectionChange: handleCountUIChange,
				onInputChange: handleCountUIInputChange,
			}}
		/>
	);
}
