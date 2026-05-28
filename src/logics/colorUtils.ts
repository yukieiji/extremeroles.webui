/**
 * <color=#RRGGBB>...</color> タグからカラーコードを抽出する
 */
export function extractColors(text: string): string[] {
	const COLOR_TAG_HEX_REGEX =
		/<color\s*=\s*["']?\s*(#[0-9A-F]{6,8})\s*["']?\s*>/gi;
	const colors: string[] = [];
	let match: RegExpExecArray | null;

	// biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
	while ((match = COLOR_TAG_HEX_REGEX.exec(text)) !== null) {
		colors.push(match[1]);
	}

	return Array.from(new Set(colors));
}

/**
 * カラータグを除去してプレーンテキストにする
 */
export function stripColorTags(text: string): string {
	return text.replace(/<color=#[0-9A-F]{6,8}>|<\/color>/gi, "");
}

/**
 * カラーコードを50%暗くする
 * #RRGGBB または #RRGGBBAA 形式をサポート
 */
export function darkenColor(hex: string, percent = 0.5): string {
	const color = hex.replace("#", "");

	// 文字数が足りない場合はそのまま返す
	if (color.length !== 6 && color.length !== 8) {
		return hex;
	}

	const hasAlpha = color.length === 8;
	let r = Number.parseInt(color.substring(0, 2), 16);
	let g = Number.parseInt(color.substring(2, 4), 16);
	let b = Number.parseInt(color.substring(4, 6), 16);
	const a = hasAlpha ? color.substring(6, 8) : "";

	r = Math.floor(r * (1 - percent));
	g = Math.floor(g * (1 - percent));
	b = Math.floor(b * (1 - percent));

	const rs = r.toString(16).padStart(2, "0");
	const gs = g.toString(16).padStart(2, "0");
	const bs = b.toString(16).padStart(2, "0");

	return `#${rs}${gs}${bs}${a}`;
}

/**
 * グラデーション文字列を生成する
 */
export function getLinearGradient(colors: string[]): string {
	if (colors.length === 1) {
		return colors[0];
	}

	return `linear-gradient(to right, ${colors.join(", ")})`;
}
