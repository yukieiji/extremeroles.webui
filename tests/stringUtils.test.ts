import { describe, expect, it } from "vitest";
import { normalizeForSearch } from "../src/logics/stringUtils";

describe("normalizeForSearch", () => {
	it("ひらがなをカタカナに変換する", () => {
		expect(normalizeForSearch("あいうえお")).toBe("アイウエオ");
	});

	it("半角カタカナを全角カタカナに変換する", () => {
		expect(normalizeForSearch("ｱｲｳｴｵ")).toBe("アイウエオ");
	});

	it("全角英数字を半角小文字に変換する", () => {
		expect(normalizeForSearch("ＡＢＣ１２３")).toBe("abc123");
	});

	it("大文字を小文字に変換する", () => {
		expect(normalizeForSearch("ABC")).toBe("abc");
	});

	it("混合文字列を正しく正規化する", () => {
		expect(normalizeForSearch("ｱｲｳあいうABCＡＢＣ１２３")).toBe(
			"アイウアイウabcabc123",
		);
	});

	it("濁点・半濁点は区別される（正規化はされる）", () => {
		// NFKCにより半角濁点は結合される
		expect(normalizeForSearch("ｶﾞ")).toBe("ガ");
		expect(normalizeForSearch("ハ")).toBe("ハ");
		expect(normalizeForSearch("バ")).toBe("バ");
		expect(normalizeForSearch("パ")).toBe("パ");

		// これらは異なる文字列として維持される
		const normalizedHa = normalizeForSearch("は");
		const normalizedBa = normalizeForSearch("ば");
		const normalizedPa = normalizeForSearch("ぱ");

		expect(normalizedHa).not.toBe(normalizedBa);
		expect(normalizedHa).not.toBe(normalizedPa);
		expect(normalizedBa).not.toBe(normalizedPa);
	});
});
