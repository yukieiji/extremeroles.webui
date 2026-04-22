import type { StateCreator } from "zustand";
import { auOptionMetaData, updateAuOption } from "../logics/api";
import { parseAuOptionId } from "../logics/optionUtils";
import { getUpdatedExRState } from "../logics/syncLogic";
import { OptionValueType } from "../type";
import type { AuOptionId, AuRoleOption } from "../type";
import type { ExROptionViewerSlice } from "./exrOptionViewerSlice";

/**
 * ExR オプションの状態を管理するスライスのインターフェース
 */
export interface AuOptionViewerSlice {
	selectedAuTabId: number;
	isAuTabPending: boolean;
	openedAuCategoryIds: Record<number, boolean>;
	auValue: Record<AuOptionId, number>; // セレクション
	setSelectedAuTabId: (id: number) => void;
	setIsAuTabPending: (isPending: boolean) => void;
	setAuValue: (value: Record<AuOptionId, number>) => void;
	toggleAuCategory: (categoryId: number) => void;
	updateAuOptionSelection: (
		...args: { auOptionId: AuOptionId; selection: number }[]
	) => void;
	updateAuOption: (auOptionId: AuOptionId, selection: number) => Promise<void>;
	updateAuRoleOption: (
		chanceOptionId: AuOptionId,
		chanceSelection: number,
		maxCountOptionId: AuOptionId,
		maxCountSelection: number,
	) => Promise<void>;
}

/**
 * ExR オプションの状態管理を行うスライスの生成
 */
export const createAuOptionViewerSlice: StateCreator<
	AuOptionViewerSlice & ExROptionViewerSlice,
	[],
	[],
	AuOptionViewerSlice
> = (set, get) => {
	return {
		selectedAuTabId: 0,
		isAuTabPending: false,
		openedAuCategoryIds: {},
		auValue: {},
		setSelectedAuTabId: (id: number) => {
			set({ selectedAuTabId: id });
		},
		setIsAuTabPending: (isPending: boolean) => {
			set({ isAuTabPending: isPending });
		},
		setAuValue(value) {
			set({ auValue: value });
		},
		toggleAuCategory: (categoryId) => {
			set((state) => {
				const next = { ...state.openedAuCategoryIds };
				next[categoryId] = !next[categoryId];
				return { openedAuCategoryIds: next };
			});
		},
		updateAuOptionSelection: (...args) => {
			set((state) => {
				const nextAuValue = { ...state.auValue };
				for (const arg of args) {
					nextAuValue[arg.auOptionId] = arg.selection;
				}
				return { auValue: nextAuValue };
			});
		},
		updateAuOption: async (auOptionId, selection) => {
			const { optionName, valueType } = parseAuOptionId(auOptionId);
			const meta = auOptionMetaData.options[auOptionId];
			if (!meta) {
				return;
			}

			const newValue = meta.range[selection];

			// ローカル状態を即時更新
			get().updateAuOptionSelection({ auOptionId, selection });

			try {
				const result = await updateAuOption({
					OptionName: optionName,
					ValueType: valueType,
					NewValue: newValue as number | boolean | AuRoleOption,
				});

				if (result) {
					set((state) => {
						const {
							nextValueData,
							nextIsOptionActive,
							valueDataChanged,
							isOptionActiveChanged,
						} = getUpdatedExRState(
							[result],
							state.exrValue,
							state.isExROptionActive,
						);

						const patch: Partial<ExROptionViewerSlice> = {};
						if (valueDataChanged) {
							patch.exrValue = nextValueData;
						}
						if (isOptionActiveChanged) {
							patch.isExROptionActive = nextIsOptionActive;
						}
						return patch;
					});
				}
			} catch (error) {
				console.error("Error updating AU option:", error);
			}
		},
		updateAuRoleOption: async (
			chanceOptionId,
			chanceSelection,
			maxCountOptionId,
			maxCountSelection,
		) => {
			const { optionName } = parseAuOptionId(chanceOptionId);
			const chanceMeta = auOptionMetaData.options[chanceOptionId];
			const maxCountMeta = auOptionMetaData.options[maxCountOptionId];

			if (!chanceMeta || !maxCountMeta) {
				return;
			}

			const chanceValue = chanceMeta.range[chanceSelection] as number;
			const maxCountValue = maxCountMeta.range[maxCountSelection] as number;

			// ローカル状態を即時更新
			get().updateAuOptionSelection(
				{ auOptionId: chanceOptionId, selection: chanceSelection },
				{ auOptionId: maxCountOptionId, selection: maxCountSelection },
			);

			try {
				const result = await updateAuOption({
					OptionName: optionName,
					ValueType: OptionValueType.RoleBase,
					NewValue: {
						Chance: chanceValue,
						MaxCount: maxCountValue,
					},
				});

				if (result) {
					set((state) => {
						const {
							nextValueData,
							nextIsOptionActive,
							valueDataChanged,
							isOptionActiveChanged,
						} = getUpdatedExRState(
							[result],
							state.exrValue,
							state.isExROptionActive,
						);

						const patch: Partial<ExROptionViewerSlice> = {};
						if (valueDataChanged) {
							patch.exrValue = nextValueData;
						}
						if (isOptionActiveChanged) {
							patch.isExROptionActive = nextIsOptionActive;
						}
						return patch;
					});
				}
			} catch (error) {
				console.error("Error updating AU RoleBase option:", error);
			}
		},
	};
};
