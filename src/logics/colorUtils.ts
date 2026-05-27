import { type ExRTabId, isGhostTabId } from "@/type";

/**
 * カラータグ（<color=#RRGGBB>...</color>）からプレーンテキストを抽出します。
 */
export function getPlainText(text: string): string {
	return text
		.replace(/<color=#[0-9A-F]{6,8}>/gi, "")
		.replace(/<\/color>/gi, "");
}

/**
 * テキストから全てのカラーコードを抽出します。
 */
export function extractColors(text: string): string[] {
	const regex = /#[0-9A-F]{6,8}/gi;
	const matches = text.match(regex);
	return matches ? Array.from(new Set(matches)) : [];
}

/**
 * 16進数カラーコードを暗くします。
 * @param hex 16進数カラーコード (#RRGGBB または #RRGGBBAA)
 * @param amount 暗くする割合 (0.5 = 50%暗くする)
 */
export function darkenColor(hex: string, amount: number): string {
	const color = hex.startsWith("#") ? hex.slice(1) : hex;
	const hasAlpha = color.length === 8;

	let r = Number.parseInt(color.slice(0, 2), 16);
	let g = Number.parseInt(color.slice(2, 4), 16);
	let b = Number.parseInt(color.slice(4, 6), 16);
	const a = hasAlpha ? color.slice(6, 8) : "";

	r = Math.floor(r * (1 - amount));
	g = Math.floor(g * (1 - amount));
	b = Math.floor(b * (1 - amount));

	const rs = r.toString(16).padStart(2, "0");
	const gs = g.toString(16).padStart(2, "0");
	const bs = b.toString(16).padStart(2, "0");

	return `#${rs}${gs}${bs}${a}`;
}

/**
 * タブIDとテキストから適用すべき色の情報を取得します。
 */
export function getTabColors(tabId: ExRTabId, text: string): string[] {
	const isGhostTab = isGhostTabId(tabId);
	let colors = extractColors(text);

	if (isGhostTab) {
		colors = colors.map((c) => darkenColor(c, 0.5));
	}

	return colors;
}

/**
 * 色の配列からインジケーター用のCSS値を生成します。
 */
export function getIndicatorColor(colors?: string[]): string {
	if (!colors || colors.length === 0) {
		return "var(--foreground)";
	}
	if (colors.length > 1) {
		return `linear-gradient(to right, ${colors.join(", ")})`;
	}
	return colors[0];
}

/**
 * 色の配列からボーダー用のCSS値を生成します。
 */
export function getBorderColor(colors?: string[]): string {
	if (!colors || colors.length === 0) {
		return "var(--border)";
	}
	if (colors.length > 1) {
		return `linear-gradient(to right, ${colors.join(", ")})`;
	}
	return colors[0];
}
