import { describe, expect, it } from "vitest";
import { ExRTabDtoArraySchema, ExRTabId } from "@/type";

describe("ExRTabDto Validation", () => {
	it("should validate a correct ExRTabDto array", () => {
		const data = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "Test Tab",
				Categories: [
					{
						Id: 1,
						Name: "Test Category",
						ColorCode: null,
						Options: [
							{
								Id: 101,
								IsActive: true,
								TranslatedName: "Test Option",
								Selection: 1,
								Format: "{0}",
								RangeMeta: {
									Type: "Int32",
									Values: [1, 2, 3],
								},
								Childs: [],
							},
						],
					},
				],
			},
		];

		const result = ExRTabDtoArraySchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should fail validation if data is incorrect", () => {
		const invalidData = [
			{
				Id: 999, // Invalid ExRTabId
				Name: "Invalid Tab",
				Categories: [],
			},
		];

		const result = ExRTabDtoArraySchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should fail validation if RangeMeta Values are mixed types", () => {
		const data = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "T",
				Categories: [
					{
						Id: 1,
						Name: "C",
						Options: [
							{
								Id: 1,
								IsActive: true,
								TranslatedName: "O",
								Selection: 0,
								Format: "",
								RangeMeta: {
									Type: "Int32",
									Values: [1, "a"], // Mixed
								},
								Childs: [],
							},
						],
					},
				],
			},
		];
		const result = ExRTabDtoArraySchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("should validate recursive Childs in ExROptionDto", () => {
		const data = [
			{
				Id: ExRTabId.GeneralTab,
				Name: "Tab",
				Categories: [
					{
						Id: 1,
						Name: "Category",
						ColorCode: null,
						Options: [
							{
								Id: 101,
								IsActive: true,
								TranslatedName: "Parent",
								Selection: 0,
								Format: "{0}",
								RangeMeta: { Type: "Int32", Values: [] },
								Childs: [
									{
										Id: 102,
										IsActive: true,
										TranslatedName: "Child",
										Selection: 0,
										Format: "{0}",
										RangeMeta: { Type: "Int32", Values: [] },
										Childs: [],
									},
								],
							},
						],
					},
				],
			},
		];

		const result = ExRTabDtoArraySchema.safeParse(data);
		expect(result.success).toBe(true);
	});
});
