import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuOptionEditor } from "../src/feature/AuOptionEditor";
import { auOptionMetaData, resetAuOptionMetaData } from "../src/logics/api";

describe("OptionEditor Components", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
	});

	it("AuOptionEditor がデータを正しく表示すること", () => {
		auOptionMetaData.categoryMetaData = {
			0: {
				name: "Test Category",
				options: [],
			},
		};
		auOptionMetaData.tabCategoryMap = { 0: [0] };

		render(<AuOptionEditor />);

		const category = screen.getByText("Test Category");
		expect(category).toBeTruthy();
	});
});
