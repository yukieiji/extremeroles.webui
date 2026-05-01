import { describe, expect, it } from "vitest";
import { filterVisibleCategoryIds, filterVisibleTopLevelOptionIds } from "../src/logics/exrOptionUtils";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId, PRESET_OPTION_UNIQUE_ID } from "../src/logics/optionUtils";

describe("exrOptionUtils", () => {
	describe("filterVisibleCategoryIds", () => {
		it("filters out categories with no active options", () => {
			resetExrOptionMetaData();
			const opt1 = getUniqueOptionId(0, 1, 101);
			const opt2 = getUniqueOptionId(0, 2, 102);

			exrOptionMetaData.globalCategoryIdTopLevelMap[1] = [opt1];
			exrOptionMetaData.globalCategoryIdTopLevelMap[2] = [opt2];

			const isExROptionActive = {
				[opt1]: true,
				[opt2]: false,
			};

			const result = filterVisibleCategoryIds([1, 2], isExROptionActive);
			expect(result).toEqual([1]);
		});

		it("filters out preset option from category 0", () => {
			resetExrOptionMetaData();
			const opt0 = PRESET_OPTION_UNIQUE_ID;
			const opt1 = getUniqueOptionId(0, 0, 101);

			exrOptionMetaData.globalCategoryIdTopLevelMap[0] = [opt0, opt1];

			const isExROptionActive = {
				[opt0]: true,
				[opt1]: false,
			};

			// opt1 is inactive, and opt0 (preset) should be ignored for visibility check
			const result = filterVisibleCategoryIds([0], isExROptionActive);
			expect(result).toEqual([]);

			// Now make opt1 active
			isExROptionActive[opt1] = true;
			const result2 = filterVisibleCategoryIds([0], isExROptionActive);
			expect(result2).toEqual([0]);
		});
	});

	describe("filterVisibleTopLevelOptionIds", () => {
		it("filters out preset option from category 0", () => {
			const opt0 = PRESET_OPTION_UNIQUE_ID;
			const opt1 = getUniqueOptionId(0, 0, 101);

			const result = filterVisibleTopLevelOptionIds(0, [opt0, opt1]);
			expect(result).toEqual([opt1]);
		});

		it("does not filter anything from other categories", () => {
			const opt1 = getUniqueOptionId(0, 1, 101);
			const result = filterVisibleTopLevelOptionIds(1, [opt1]);
			expect(result).toEqual([opt1]);
		});
	});
});
