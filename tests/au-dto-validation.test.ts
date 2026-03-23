import { describe, expect, it } from "vitest";
import { AuOptionCategoryDtoArraySchema, OptionValueType } from "../src/type";

describe("AuOptionCategoryDto Validation", () => {
	it("should validate a correct AuOptionCategoryDto array", () => {
		const data = [
			{
				TranslatedTitle: "Game Settings",
				Options: [
					{
						TranslatedTitle: "Map",
						TranslatedFormat: "{0}",
						Value: 0,
						Info: {
							ValueType: OptionValueType.Byte,
							OptionName: 1,
						},
						Range: ["The Skeld", "Mira HQ"],
					},
					{
						TranslatedTitle: "Sheriff",
						TranslatedFormat: "{0}",
						Value: {
							MaxCount: 1,
							Chance: 100,
						},
						Info: {
							ValueType: OptionValueType.RoleBase,
							OptionName: 101,
						},
						Range: null,
					},
					{
						TranslatedTitle: "Anonymous Voting",
						TranslatedFormat: "{0}",
						Value: true,
						Info: {
							ValueType: OptionValueType.Bool,
							OptionName: 3,
						},
						Range: ["OFF", "ON"],
					},
				],
			},
		];

		const result = AuOptionCategoryDtoArraySchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should fail validation if Value is a string", () => {
		const invalidData = [
			{
				TranslatedTitle: "Settings",
				Options: [
					{
						TranslatedTitle: "Invalid Option",
						TranslatedFormat: "{0}",
						Value: "string value", // No longer allowed
						Info: {
							ValueType: OptionValueType.Int,
							OptionName: 1,
						},
						Range: [],
					},
				],
			},
		];

		const result = AuOptionCategoryDtoArraySchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should fail validation if Value is incorrect for AuRoleOption", () => {
		const invalidData = [
			{
				TranslatedTitle: "Role Settings",
				Options: [
					{
						TranslatedTitle: "Sheriff",
						TranslatedFormat: "{0}",
						Value: {
							MaxCount: "1", // Should be number
							Chance: 100,
						},
						Info: {
							ValueType: OptionValueType.RoleBase,
							OptionName: 101,
						},
						Range: null,
					},
				],
			},
		];

		const result = AuOptionCategoryDtoArraySchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should fail validation if OptionValueType is invalid", () => {
		const invalidData = [
			{
				TranslatedTitle: "Settings",
				Options: [
					{
						TranslatedTitle: "Opt",
						TranslatedFormat: "{0}",
						Value: 1,
						Info: {
							ValueType: 99, // Invalid enum value
							OptionName: 1,
						},
						Range: [],
					},
				],
			},
		];

		const result = AuOptionCategoryDtoArraySchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
