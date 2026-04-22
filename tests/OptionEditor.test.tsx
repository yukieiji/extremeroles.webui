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
				options: [100 as any],
			},
		};
		auOptionMetaData.options[100 as any] = {
			title: "Map",
			format: "",
			range: ["The Skeld"],
		};
		auOptionMetaData.tabCategoryMap = { 0: [0] };

		render(<AuOptionEditor />);

		const mapLabel = screen.getByText("Map");
		expect(mapLabel).toBeTruthy();
	});
});
