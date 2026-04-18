import { beforeEach, describe, expect, it } from "vitest";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import {
	findClosestIndex,
	getBaseOptionName,
	getOptionLabel,
	getOptionPairType,
	getUniqueOptionId,
	groupOptionPairs,
} from "../src/logics/optionUtils";

describe("optionUtils", () => {
	beforeEach(() => {
		resetExrOptionMetaData();
	});

	describe("getUniqueOptionId", () => {
		it("should generate numeric ID correctly", () => {
			// Tab 1, Category 2, Option 3 -> 100,000,000 + 20,000 + 3 = 100,020,003
			expect(getUniqueOptionId(1, 2, 3)).toBe(100020003);
		});

		it("should handle tab ID 0", () => {
			// Tab 0, Category 1, Option 1 -> 10,000 + 1 = 10,001
			expect(getUniqueOptionId(0, 1, 1)).toBe(10001);
		});

		it("should handle large IDs", () => {
			// Tab 10, Category 9999, Option 9999
			expect(getUniqueOptionId(10, 9999, 9999)).toBe(1099999999);
		});
	});

	describe("getOptionPairType", () => {
		it("should identify Japanese min/max", () => {
			expect(getOptionPairType("テスト 最小")).toBe("min");
			expect(getOptionPairType("テスト 最大")).toBe("max");
		});

		it("should identify English min/max", () => {
			expect(getOptionPairType("Test Min")).toBe("min");
			expect(getOptionPairType("Test Max")).toBe("max");
		});

		it("should identify Chinese min/max", () => {
			expect(getOptionPairType("测试 最小值")).toBe("min");
			expect(getOptionPairType("测试 最大值")).toBe("max");
		});

		it("should return none for other names", () => {
			expect(getOptionPairType("テスト")).toBe("none");
			expect(getOptionPairType("最小テスト")).toBe("none");
		});
	});

	describe("findClosestIndex", () => {
		it("should find exact match", () => {
			expect(findClosestIndex([0, 10, 20], 10)).toBe(1);
		});

		it("should find closest value", () => {
			expect(findClosestIndex([0, 10, 20], 12)).toBe(1);
			expect(findClosestIndex([0, 10, 20], 18)).toBe(2);
		});

		it("should handle boundary values", () => {
			expect(findClosestIndex([0, 10, 20], -5)).toBe(0);
			expect(findClosestIndex([0, 10, 20], 25)).toBe(2);
		});

		it("should return 0 for empty array", () => {
			expect(findClosestIndex([], 10)).toBe(0);
		});
	});

	describe("getBaseOptionName", () => {
		it("should remove suffixes", () => {
			expect(getBaseOptionName("テスト 最小")).toBe("テスト");
			expect(getBaseOptionName("テスト 最大")).toBe("テスト");
			expect(getBaseOptionName("Test Min")).toBe("Test");
			expect(getBaseOptionName("测试 最大值")).toBe("测试");
		});
	});

	describe("getOptionLabel", () => {
		it("extracts Japanese label", () => {
			expect(getOptionLabel("テスト 最小")).toBe("最小");
			expect(getOptionLabel("テスト 最大")).toBe("最大");
		});

		it("extracts English label", () => {
			expect(getOptionLabel("Test Min")).toBe("Min");
			expect(getOptionLabel("Test Max")).toBe("Max");
		});

		it("extracts parenthesized label", () => {
			expect(getOptionLabel("Test (Min)")).toBe("(Min)");
		});

		it("returns empty string if no suffix", () => {
			expect(getOptionLabel("テスト")).toBe("");
		});
	});

	describe("groupOptionPairs", () => {
		const setupMockMeta = (
			tabId: number,
			categoryId: number,
			id: number,
			name: string,
		) => {
			const uniqueId = getUniqueOptionId(tabId, categoryId, id);
			exrOptionMetaData.optionMetaData[uniqueId] = {
				translatedName: name,
				format: "",
				type: "Int32",
			};
		};

		it("should group consecutive min/max pairs", () => {
			const tabId = 1;
			const categoryId = 1;
			setupMockMeta(tabId, categoryId, 1, "A 最小");
			setupMockMeta(tabId, categoryId, 2, "A 最大");
			setupMockMeta(tabId, categoryId, 3, "B");

			const options = [
				getUniqueOptionId(tabId, categoryId, 1),
				getUniqueOptionId(tabId, categoryId, 2),
				getUniqueOptionId(tabId, categoryId, 3),
			];
			const grouped = groupOptionPairs(options);
			expect(grouped).toHaveLength(2);
			expect(grouped[0]).toEqual({
				type: "pair",
				baseName: "A",
				minData: {
					uniqueOptionId: getUniqueOptionId(tabId, categoryId, 1),
					metaData:
						exrOptionMetaData.optionMetaData[
							getUniqueOptionId(tabId, categoryId, 1)
						],
					label: "最小",
				},
				maxData: {
					uniqueOptionId: getUniqueOptionId(tabId, categoryId, 2),
					metaData:
						exrOptionMetaData.optionMetaData[
							getUniqueOptionId(tabId, categoryId, 2)
						],
					label: "最大",
				},
			});
			expect(grouped[1]).toBe(getUniqueOptionId(tabId, categoryId, 3));
		});

		it("should not group non-consecutive pairs", () => {
			const tabId = 1;
			const categoryId = 2;
			setupMockMeta(tabId, categoryId, 1, "A 最小");
			setupMockMeta(tabId, categoryId, 3, "B");
			setupMockMeta(tabId, categoryId, 2, "A 最大");

			const options = [
				getUniqueOptionId(tabId, categoryId, 1),
				getUniqueOptionId(tabId, categoryId, 3),
				getUniqueOptionId(tabId, categoryId, 2),
			];
			const grouped = groupOptionPairs(options);
			// 仕様により、連続しないペアやその間の要素は除外される（最後の一つを除く）
			expect(grouped).toHaveLength(1);
			expect(grouped[0]).toBe(getUniqueOptionId(tabId, categoryId, 2));
		});
	});
});
