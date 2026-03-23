import { describe, expect, it } from "vitest";
import { PresetNamesSchema } from "../src/type";

describe("PresetNamesSchema", () => {
	it("should validate valid preset names object", () => {
		const validData = {
			"0": "Hardcore",
			"1": "Casual",
		};
		const result = PresetNamesSchema.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual(validData);
		}
	});

	it("should reject non-object data", () => {
		const invalidData = "not an object";
		const result = PresetNamesSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject non-string values", () => {
		const invalidData = {
			"0": 123,
		};
		const result = PresetNamesSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should allow empty object", () => {
		const emptyData = {};
		const result = PresetNamesSchema.safeParse(emptyData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual(emptyData);
		}
	});
});
