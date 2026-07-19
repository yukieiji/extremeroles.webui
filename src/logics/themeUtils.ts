/**
 * テーマを適用するためのユーティリティ関数
 */
export function applyTheme(theme: "light" | "dark" | "system") {
	if (typeof window === "undefined" || !window.document) {
		return;
	}
	const root = window.document.documentElement;
	let isDark = false;

	if (theme === "system") {
		isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	} else {
		isDark = theme === "dark";
	}

	if (isDark) {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
}
