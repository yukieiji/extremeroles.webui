import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme } from "@/logics/themeUtils";

describe("applyTheme", () => {
	let classList: string[] = [];

	beforeEach(() => {
		classList = [];
		// document.documentElement のクラスをモック
		vi.stubGlobal("document", {
			documentElement: {
				classList: {
					add: (className: string) => {
						if (!classList.includes(className)) {
							classList.push(className);
						}
					},
					remove: (className: string) => {
						classList = classList.filter((c) => c !== className);
					},
					contains: (className: string) => classList.includes(className),
				},
			},
		});

		// matchMedia をモック
		vi.stubGlobal("window", {
			document: {
				documentElement: {
					classList: {
						add: (className: string) => {
							if (!classList.includes(className)) {
								classList.push(className);
							}
						},
						remove: (className: string) => {
							classList = classList.filter((c) => c !== className);
						},
						contains: (className: string) => classList.includes(className),
					},
				},
			},
			matchMedia: vi.fn().mockImplementation((query: string) => ({
				matches: query.includes("dark"),
			})),
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("applies dark theme", () => {
		applyTheme("dark");
		expect(classList).toContain("dark");
	});

	it("applies light theme", () => {
		applyTheme("light");
		expect(classList).not.toContain("dark");
	});

	it("applies system theme (prefers-dark true)", () => {
		applyTheme("system");
		expect(classList).toContain("dark");
	});

	it("applies system theme (prefers-dark false)", () => {
		vi.stubGlobal("window", {
			document: {
				documentElement: {
					classList: {
						add: (className: string) => {
							if (!classList.includes(className)) {
								classList.push(className);
							}
						},
						remove: (className: string) => {
							classList = classList.filter((c) => c !== className);
						},
					},
				},
			},
			matchMedia: vi.fn().mockImplementation(() => ({
				matches: false,
			})),
		});

		applyTheme("system");
		expect(classList).not.toContain("dark");
	});
});
