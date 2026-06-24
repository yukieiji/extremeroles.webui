/**
 * 検索用の文字列正規化。
 * ひらがな・カタカナ、全角・半角（英数字・カタカナ）の区別をなくす。
 * 濁点・半濁点の有無は区別される（NFKC正規化により結合文字は合成される）。
 */
export function normalizeForSearch(str: string): string {
	return str
		.normalize("NFKC") // 全角英数字を半角に、半角カタカナを全角に変換
		.replace(/[\u3041-\u3096]/g, (match) => {
			return String.fromCharCode(match.charCodeAt(0) + 0x60);
		}) // ひらがなをカタカナに変換
		.toLowerCase(); // 大文字を小文字に変換
}

/**
 * プレースホルダーを含む文字列を置換します。
 * @param template テンプレート文字列（例: "こんにちは {0} さん"）
 * @param args 置換する値
 * @returns 置換後の文字列
 */
export function format(template: string, ...args: (string | number)[]): string {
	return template.replace(/{(\d+)}/g, (match, index) => {
		const arg = args[Number(index)];
		return arg !== undefined ? String(arg) : match;
	});
}
