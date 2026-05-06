import { describe, expect, it } from "vitest";
import { GetCsvResultSchema } from "@/type";

describe("GetCsvResult Validation", () => {
	it("should validate a correct GetCsvResult", () => {
		const data = {
			ExportAt: "2023-10-27T10:00:00Z",
			Version: "1.0.0",
			CsvBody: "Header1,Header2\nValue1,Value2",
		};

		const result = GetCsvResultSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("should fail validation if GetCsvResult has missing fields", () => {
		const data = {
			ExportAt: "2023-10-27T10:00:00Z",
			// Version missing
			CsvBody: "Header1,Header2\nValue1,Value2",
		};

		const result = GetCsvResultSchema.safeParse(data);
		expect(result.success).toBe(false);
	});
});
