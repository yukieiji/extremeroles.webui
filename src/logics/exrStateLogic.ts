import type {
	ExRCategoryDto,
	ExROptionDto,
	ExROptionValueData,
	UniqueOptionId,
	UpdatedOptions,
} from "../type";
import { exrOptionMetaData } from "./api";
import { getUniqueOptionId } from "./optionUtils";

/**
 * UpdatedOptionsの情報を元に、ExRのオプション状態を更新するための情報を生成します
 */
export function getUpdatedExRState(
	updateResults: (UpdatedOptions | null)[],
	currentExrValue: Record<UniqueOptionId, ExROptionValueData>,
	currentIsExROptionActive: Record<UniqueOptionId, boolean>,
) {
	let nextValueData = currentExrValue;
	let nextIsOptionActive = currentIsExROptionActive;

	let valueDataChanged = false;
	let isOptionActiveChanged = false;
	const newlyBecameAccordionIds: UniqueOptionId[] = [];

	const processOption = (opt: ExROptionDto, catId: number, tId: number) => {
		const uId = getUniqueOptionId(tId, catId, opt.Id);

		// values
		const currentValData = nextValueData[uId];
		if (
			!currentValData ||
			currentValData.selection !== opt.Selection ||
			currentValData.values.length !== opt.RangeMeta.Values.length ||
			currentValData.values.some((v, i) => v !== opt.RangeMeta.Values[i])
		) {
			if (!valueDataChanged) {
				nextValueData = { ...nextValueData };
				valueDataChanged = true;
			}
			nextValueData[uId] = {
				selection: opt.Selection,
				values: opt.RangeMeta.Values,
			};
		}

		// isOptionActive
		if (nextIsOptionActive[uId] !== opt.IsActive) {
			if (!isOptionActiveChanged) {
				nextIsOptionActive = { ...nextIsOptionActive };
				isOptionActiveChanged = true;
			}
			nextIsOptionActive[uId] = opt.IsActive;
		}

		if (opt.Childs) {
			const hasAnyActiveBefore =
				exrOptionMetaData.options[uId]?.childOptionIds.some(
					(childId) => currentIsExROptionActive[childId],
				) ?? false;

			for (const child of opt.Childs) {
				processOption(child, catId, tId);
			}

			const hasAnyActiveAfter =
				exrOptionMetaData.options[uId]?.childOptionIds.some(
					(childId) => nextIsOptionActive[childId],
				) ?? false;

			if (!hasAnyActiveBefore && hasAnyActiveAfter) {
				newlyBecameAccordionIds.push(uId);
			}
		}
	};

	const processCategory = (cat: ExRCategoryDto) => {
		const tId = exrOptionMetaData.categories[cat.Id]?.tabId;
		if (tId === undefined) {
			return;
		}
		for (const opt of cat.Options) {
			processOption(opt, cat.Id, tId);
		}
	};

	for (const x of updateResults) {
		if (!x) {
			continue;
		}
		if (x.UpdatedCategory) {
			processCategory(x.UpdatedCategory);
		}

		for (const chain of x.ChainUpdatedOption) {
			const tId = exrOptionMetaData.categories[chain.Id]?.tabId;
			if (tId === undefined) {
				continue;
			}
			for (const opt of chain.Options) {
				processOption(opt, chain.Id, tId);
			}
		}
	}

	return {
		nextValueData,
		nextIsOptionActive,
		valueDataChanged,
		isOptionActiveChanged,
		newlyBecameAccordionIds,
	};
}
