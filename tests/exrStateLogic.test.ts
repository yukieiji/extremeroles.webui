import { beforeEach, describe, expect, it } from "vitest";
import { exrOptionMetaData, resetExrOptionMetaData } from "@/logics/api";
import { getUpdatedExRState } from "@/logics/exrStateLogic";
import { getUniqueOptionId } from "@/logics/optionUtils";
import type {
	ExROptionValueData,
	UniqueOptionId,
	UpdatedOptions,
} from "@/type";
import { ExRTabId } from "@/type";

describe("exrStateLogic", () => {
	beforeEach(() => {
		resetExrOptionMetaData();
	});

	it("should return unchanged state when updateResults is empty", () => {
		const currentExrValue: Record<UniqueOptionId, ExROptionValueData> = {};
		const currentIsExROptionActive: Record<UniqueOptionId, boolean> = {};

		const result = getUpdatedExRState(
			[],
			currentExrValue,
			currentIsExROptionActive,
		);

		expect(result.nextValueData).toBe(currentExrValue);
		expect(result.nextIsOptionActive).toBe(currentIsExROptionActive);
		expect(result.valueDataChanged).toBe(false);
		expect(result.isOptionActiveChanged).toBe(false);
	});

	it("should skip null in updateResults", () => {
		const currentExrValue: Record<UniqueOptionId, ExROptionValueData> = {};
		const currentIsExROptionActive: Record<UniqueOptionId, boolean> = {};

		const result = getUpdatedExRState(
			[null],
			currentExrValue,
			currentIsExROptionActive,
		);

		expect(result.valueDataChanged).toBe(false);
	});

	it("should update state from UpdatedCategory", () => {
		const catId = 100;
		const tabId = ExRTabId.CrewmateTab;
		const optId = 1;
		const uId = getUniqueOptionId(tabId, catId, optId);

		exrOptionMetaData.categories[catId] = { name: "Test Category", tabId };

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Test Category",
					Options: [
						{
							Id: optId,
							IsActive: true,
							TranslatedName: "Test Option",
							Selection: 5,
							Format: "Format",
							RangeMeta: { Type: "Int32", Values: [0, 5, 10] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];

		const currentExrValue: Record<UniqueOptionId, ExROptionValueData> = {};
		const currentIsExROptionActive: Record<UniqueOptionId, boolean> = {};

		const result = getUpdatedExRState(
			updateResults,
			currentExrValue,
			currentIsExROptionActive,
		);

		expect(result.nextValueData[uId]).toEqual({
			selection: 5,
			values: [0, 5, 10],
		});
		expect(result.nextIsOptionActive[uId]).toBe(true);
		expect(result.valueDataChanged).toBe(true);
		expect(result.isOptionActiveChanged).toBe(true);
	});

	it("should update state from ChainUpdatedOption", () => {
		const catId = 200;
		const tabId = ExRTabId.ImpostorTab;
		const optId = 2;
		const uId = getUniqueOptionId(tabId, catId, optId);

		exrOptionMetaData.categories[catId] = { name: "Chain Category", tabId };

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: null,
				ChainUpdatedOption: [
					{
						Id: catId,
						Options: [
							{
								Id: optId,
								IsActive: false,
								TranslatedName: "Chain Option",
								Selection: 1,
								Format: "Format",
								RangeMeta: { Type: "Int32", Values: [0, 1] },
								Childs: [],
							},
						],
					},
				],
			},
		];

		const currentExrValue: Record<UniqueOptionId, ExROptionValueData> = {
			[uId]: { selection: 0, values: [0, 1] },
		};
		const currentIsExROptionActive: Record<UniqueOptionId, boolean> = {
			[uId]: true,
		};

		const result = getUpdatedExRState(
			updateResults,
			currentExrValue,
			currentIsExROptionActive,
		);

		expect(result.nextValueData[uId].selection).toBe(1);
		expect(result.nextIsOptionActive[uId]).toBe(false);
		expect(result.valueDataChanged).toBe(true);
		expect(result.isOptionActiveChanged).toBe(true);
	});

	it("should process child options recursively", () => {
		const catId = 300;
		const tabId = ExRTabId.NeutralTab;
		const parentOptId = 10;
		const childOptId = 11;
		const parentUId = getUniqueOptionId(tabId, catId, parentOptId);
		const childUId = getUniqueOptionId(tabId, catId, childOptId);

		exrOptionMetaData.categories[catId] = { name: "Nested Category", tabId };

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Nested Category",
					Options: [
						{
							Id: parentOptId,
							IsActive: true,
							TranslatedName: "Parent",
							Selection: 0,
							Format: "",
							RangeMeta: { Type: "Single", Values: [0] },
							Childs: [
								{
									Id: childOptId,
									IsActive: true,
									TranslatedName: "Child",
									Selection: 1,
									Format: "",
									RangeMeta: { Type: "Single", Values: [0, 1] },
									Childs: [],
								},
							],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];

		const result = getUpdatedExRState(updateResults, {}, {});

		expect(result.nextValueData[parentUId]).toBeDefined();
		expect(result.nextValueData[childUId]).toBeDefined();
		expect(result.nextValueData[childUId].selection).toBe(1);
	});

	it("should not mark as changed if values are the same", () => {
		const catId = 400;
		const tabId = ExRTabId.CombinationTab;
		const optId = 40;
		const uId = getUniqueOptionId(tabId, catId, optId);

		exrOptionMetaData.categories[catId] = { name: "Same Category", tabId };

		const currentExrValue = {
			[uId]: { selection: 2, values: [0, 1, 2] },
		};
		const currentIsExROptionActive = {
			[uId]: true,
		};

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Same Category",
					Options: [
						{
							Id: optId,
							IsActive: true,
							TranslatedName: "Same Option",
							Selection: 2,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [0, 1, 2] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];

		const result = getUpdatedExRState(
			updateResults,
			currentExrValue,
			currentIsExROptionActive,
		);

		expect(result.valueDataChanged).toBe(false);
		expect(result.isOptionActiveChanged).toBe(false);
		expect(result.nextValueData).toBe(currentExrValue);
		expect(result.nextIsOptionActive).toBe(currentIsExROptionActive);
	});

	it("should skip if category metadata is missing", () => {
		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: 999,
					Name: "Unknown",
					Options: [],
				},
				ChainUpdatedOption: [
					{
						Id: 888,
						Options: [],
					},
				],
			},
		];

		const result = getUpdatedExRState(updateResults, {}, {});

		expect(result.valueDataChanged).toBe(false);
		expect(result.isOptionActiveChanged).toBe(false);
	});

	it("should identify newly became accordion options", () => {
		const catId = 800;
		const tabId = ExRTabId.CrewmateTab;
		const parentOptId = 100;
		const childOptId = 101;
		const parentUId = getUniqueOptionId(tabId, catId, parentOptId);
		const childUId = getUniqueOptionId(tabId, catId, childOptId);

		exrOptionMetaData.categories[catId] = { name: "Accordion Test", tabId };
		exrOptionMetaData.options[parentUId] = {
			metaData: { translatedName: "Parent", format: "", type: "" },
			childOptionIds: [childUId],
			parentOptionIds: [],
		};

		const currentExrValue = {
			[parentUId]: { selection: 0, values: [0] },
			[childUId]: { selection: 0, values: [0] },
		};
		const currentIsExROptionActive = {
			[parentUId]: true,
			[childUId]: false, // Initially child is inactive, so parent is not an accordion
		};

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Accordion Test",
					Options: [
						{
							Id: parentOptId,
							IsActive: true,
							TranslatedName: "Parent",
							Selection: 0,
							Format: "",
							RangeMeta: { Type: "Single", Values: [0] },
							Childs: [
								{
									Id: childOptId,
									IsActive: true, // Child becomes active!
									TranslatedName: "Child",
									Selection: 0,
									Format: "",
									RangeMeta: { Type: "Single", Values: [0] },
									Childs: [],
								},
							],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];

		const result = getUpdatedExRState(
			updateResults,
			currentExrValue,
			currentIsExROptionActive,
		);

		// We expect parentUId to be identified as newly became accordion
		expect(result.newlyBecameAccordionIds).toContain(parentUId);
	});

	it("should handle mixed updates and multiple results", () => {
		const catId1 = 501;
		const tabId1 = ExRTabId.CrewmateTab;
		const uId1 = getUniqueOptionId(tabId1, catId1, 1);

		const catId2 = 502;
		const tabId2 = ExRTabId.ImpostorTab;
		const uId2 = getUniqueOptionId(tabId2, catId2, 2);

		exrOptionMetaData.categories[catId1] = { name: "Cat 1", tabId: tabId1 };
		exrOptionMetaData.categories[catId2] = { name: "Cat 2", tabId: tabId2 };

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId1,
					Name: "Cat 1",
					Options: [
						{
							Id: 1,
							IsActive: true,
							TranslatedName: "Opt 1",
							Selection: 10,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [10] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
			{
				UpdatedCategory: null,
				ChainUpdatedOption: [
					{
						Id: catId2,
						Options: [
							{
								Id: 2,
								IsActive: false,
								TranslatedName: "Opt 2",
								Selection: 20,
								Format: "",
								RangeMeta: { Type: "Int32", Values: [20] },
								Childs: [],
							},
						],
					},
				],
			},
		];

		const result = getUpdatedExRState(updateResults, {}, {});

		expect(result.nextValueData[uId1].selection).toBe(10);
		expect(result.nextValueData[uId2].selection).toBe(20);
		expect(result.nextIsOptionActive[uId1]).toBe(true);
		expect(result.nextIsOptionActive[uId2]).toBe(false);
		expect(result.valueDataChanged).toBe(true);
		expect(result.isOptionActiveChanged).toBe(true);
	});

	it("should mark valueDataChanged only once when multiple values change", () => {
		const catId = 600;
		const tabId = ExRTabId.CrewmateTab;
		const uId1 = getUniqueOptionId(tabId, catId, 1);
		const uId2 = getUniqueOptionId(tabId, catId, 2);

		exrOptionMetaData.categories[catId] = { name: "Cat", tabId };

		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Cat",
					Options: [
						{
							Id: 1,
							IsActive: true,
							TranslatedName: "Opt 1",
							Selection: 1,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [0, 1] },
							Childs: [],
						},
						{
							Id: 2,
							IsActive: true,
							TranslatedName: "Opt 2",
							Selection: 1,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [0, 1] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];

		const result = getUpdatedExRState(updateResults, {}, {});

		expect(result.valueDataChanged).toBe(true);
		expect(result.nextValueData[uId1].selection).toBe(1);
		expect(result.nextValueData[uId2].selection).toBe(1);
	});

	it("should detect changes in values array length or content", () => {
		const catId = 700;
		const tabId = ExRTabId.CrewmateTab;
		const uId = getUniqueOptionId(tabId, catId, 1);

		exrOptionMetaData.categories[catId] = { name: "Cat", tabId };

		const currentExrValue = {
			[uId]: { selection: 0, values: [0, 1] },
		};

		// Case: Length change
		const updateResultsLen: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Cat",
					Options: [
						{
							Id: 1,
							IsActive: true,
							TranslatedName: "",
							Selection: 0,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [0, 1, 2] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];
		const resultLen = getUpdatedExRState(updateResultsLen, currentExrValue, {
			[uId]: true,
		});
		expect(resultLen.valueDataChanged).toBe(true);

		// Case: Content change
		const updateResultsContent: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: {
					Id: catId,
					Name: "Cat",
					Options: [
						{
							Id: 1,
							IsActive: true,
							TranslatedName: "",
							Selection: 0,
							Format: "",
							RangeMeta: { Type: "Int32", Values: [0, 2] },
							Childs: [],
						},
					],
				},
				ChainUpdatedOption: [],
			},
		];
		const resultContent = getUpdatedExRState(
			updateResultsContent,
			currentExrValue,
			{ [uId]: true },
		);
		expect(resultContent.valueDataChanged).toBe(true);
	});

	it("should skip if category metadata is missing in ChainUpdatedOption", () => {
		const updateResults: (UpdatedOptions | null)[] = [
			{
				UpdatedCategory: null,
				ChainUpdatedOption: [
					{
						Id: 999, // Missing category ID
						Options: [
							{
								Id: 1,
								IsActive: true,
								TranslatedName: "",
								Selection: 0,
								Format: "",
								RangeMeta: { Type: "Int32", Values: [0] },
								Childs: [],
							},
						],
					},
				],
			},
		];

		const result = getUpdatedExRState(updateResults, {}, {});

		expect(result.valueDataChanged).toBe(false);
	});
});
