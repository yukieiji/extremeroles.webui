import { RoleSpawnControls } from "../../components/blocks/RoleSpawnControls";
import { auOptionMetaData } from "../../logics/api";
import { useUpdateAuRoleOptionSelection } from "../../logics/api.store";
import { findClosestIndex } from "../../logics/optionUtils";
import { useStore } from "../../useStore";

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
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const isOpenedCategory = useStore(
		(state) => state.openedAuCategoryIds[categoryId] ?? false,
	);

	const updateAuOption = useUpdateAuRoleOptionSelection();

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
		const newChanceValue = chanceValues[newSelection] ?? 0;
		const isBecomingEnabled = isMaxCountZero && newChanceValue > 0;

		const chanceUpdate = {
			auOptionId: chanceOptionId,
			selection: newSelection,
		};

		// Chanceが0%以外に変更されたとき、数が0なら1にあげる
		if (isBecomingEnabled) {
			updateAuOption(chanceUpdate, {
				auOptionId: maxCountOptionId,
				selection: findClosestIndex(maxCountValues, 1),
			});
		} else if (newChanceValue === 0) {
			// Chanceが0%になったら、スポーン数も0にしてアコーディオンを閉じる
			updateAuOption(chanceUpdate, {
				auOptionId: maxCountOptionId,
				selection: 0,
			});
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		} else {
			updateAuOption(chanceUpdate, {
				auOptionId: maxCountOptionId,
				selection: maxCountSelection,
			});
		}

		if (isBecomingEnabled && !isOpenedCategory) {
			toggleAuCategory(categoryId);
		}
	};

	const handleChanceInputChange = (val: number) => {
		handleChanceChange(findClosestIndex(chanceValues, val));
	};

	const handleMaxCountChange = (newSelection: number) => {
		const newMaxCountValue = maxCountValues[newSelection] ?? 0;
		const isBecomingEnabled = isChanceZero && newMaxCountValue > 0;

		const maxCountUpdate = {
			auOptionId: maxCountOptionId,
			selection: newSelection,
		};

		// 数が0以外に変更されたとき、現在Chanceが0%なら10%に上げる
		if (isBecomingEnabled) {
			updateAuOption(
				{
					auOptionId: chanceOptionId,
					selection: findClosestIndex(chanceValues, 10),
				},
				maxCountUpdate,
			);
		} else if (newMaxCountValue === 0) {
			// 数を0にすると、Chanceも0%にする
			updateAuOption(
				{
					auOptionId: chanceOptionId,
					selection: findClosestIndex(chanceValues, 0),
				},
				maxCountUpdate,
			);
			if (isOpenedCategory) {
				toggleAuCategory(categoryId);
			}
		} else {
			updateAuOption(
				{
					auOptionId: chanceOptionId,
					selection: chanceSelection,
				},
				maxCountUpdate,
			);
		}

		if (isBecomingEnabled && !isOpenedCategory) {
			toggleAuCategory(categoryId);
		}
	};

	const handleMaxCountInputChange = (val: number) => {
		handleMaxCountChange(findClosestIndex(maxCountValues, val));
	};

	return (
		<RoleSpawnControls
			rate={{
				values: chanceValues,
				currentSelection: chanceSelection,
				onSelectionChange: handleChanceChange,
				onInputChange: handleChanceInputChange,
			}}
			num={{
				values: maxCountValues,
				currentSelection: maxCountSelection,
				onSelectionChange: handleMaxCountChange,
				onInputChange: handleMaxCountInputChange,
			}}
		/>
	);
}
