import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuOptionEditor } from "../src/feature/AuOptionEditor";
import { auOptionMetaData } from "../src/logics/api";

describe("OptionEditor Components", () => {
	it("AuOptionEditor がデータを正しく表示すること", () => {
		auOptionMetaData.categoryMetaData = {
			0: {
				name: "Test Category",
				options: [],
			},
		};
		auOptionMetaData.tabCategoryMap = { 0: [0] };

		render(<AuOptionEditor />);

		const pre = screen.getByText((content) => {
			return content.includes('"categoryName": "Test Category"');
		});
		expect(pre).toBeTruthy();
	});
});
