/**
 * カラータグ（<color=#RRGGBB>...</color>）からプレーンテキストを抽出します。
 */
export function getPlainText(text: string): string {
	return text.replace(/<color=#[0-9A-F]{6,8}>/gi, "").replace(/<\/color>/gi, "");
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
 * タブIDとテキストから適用すべきボーダー/インジケーターのスタイルを生成します。
 */
export function getTabColorStyle(
	tabId: number,
	text: string,
) {
	const isGhostTab = tabId >= 5 && tabId <= 7;
	let colors = extractColors(text);

	if (isGhostTab) {
		colors = colors.map((c) => darkenColor(c, 0.5));
	}

	if (colors.length === 0) {
		return {
			borderColor: "", // Use default
			indicatorColor: "var(--foreground)",
			isGradient: false,
		};
	}

	if (tabId === 4 && colors.length > 1) {
		// CombinationTab
		const gradient = `linear-gradient(to right, ${colors.join(", ")})`;
		return {
			borderColor: gradient,
			indicatorColor: gradient,
			isGradient: true,
		};
	}

	const color = colors[0];
	return {
		borderColor: color,
		indicatorColor: color,
		isGradient: false,
	};
}
