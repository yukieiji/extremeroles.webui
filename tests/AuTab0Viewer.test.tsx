import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuTab0Viewer } from "../src/feature/AuTab0Viewer";
import {
	auOptionMetaData,
	resetAuOptionMetaData,
	translationMetaData,
} from "../src/logics/api";
import type { AuOptionId } from "../src/type";
import { useStore } from "../src/useStore";

describe("AuTab0Viewer", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetAll();
		useStore.getState().resetViewer();
		// 翻訳データの初期化
		translationMetaData.booleanTransData = ["OFF", "ON"];
	});

	it("renders Tab 0 categories and options", () => {
		const optionId = 100 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [1], 1: [], 2: [] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Game Settings", options: [optionId] },
		};
		auOptionMetaData.options[optionId] = {
			title: "Map",
			format: "{0}",
			range: ["The Skeld", "Mira HQ"],
		};
		useStore.getState().setAuValue({ [optionId]: 0 });

		render(<AuTab0Viewer />);

		expect(screen.getByText("Game Settings")).toBeInTheDocument();
		expect(screen.getByText("Map")).toBeInTheDocument();
		expect(screen.getByText("The Skeld")).toBeInTheDocument();
	});

	it("uses translation data for boolean values", () => {
		const boolOptionId = 101 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [1] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Settings", options: [boolOptionId] },
		};
		auOptionMetaData.options[boolOptionId] = {
			title: "Anonymous Voting",
			format: "{0}",
			range: [false, true],
		};

		// 翻訳テキストを設定
		translationMetaData.booleanTransData = ["無効", "有効"];
		useStore.getState().setAuValue({ [boolOptionId]: 1 });

		render(<AuTab0Viewer />);

		expect(screen.getByText("有効")).toBeInTheDocument();
	});

	it("calls store actions and scroll on double click", async () => {
		const optionId = 100 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [1] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Game Settings", options: [optionId] },
		};
		auOptionMetaData.options[optionId] = {
			title: "Map",
			format: "{0}",
			range: ["The Skeld"],
		};

		const setSelectedTabSpy = vi.spyOn(useStore.getState(), "setSelectedTab");
		const setSelectedAuTabIdSpy = vi.spyOn(
			useStore.getState(),
			"setSelectedAuTabId",
		);
		const setHighlightedAuOptionIdSpy = vi.spyOn(
			useStore.getState(),
			"setHighlightedAuOptionId",
		);

		// scrollIntoView のモック
		const scrollIntoViewMock = vi.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		// getElementById のモック
		const mockElement = document.createElement("div");
		mockElement.id = `au-option-${optionId}`;
		vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

		render(<AuTab0Viewer />);

		const row = screen.getByText("Map").closest("button");
		if (!row) throw new Error("Row not found");

		fireEvent.doubleClick(row);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("Au");
		expect(setSelectedAuTabIdSpy).toHaveBeenCalledWith(0);
		expect(setHighlightedAuOptionIdSpy).toHaveBeenCalledWith(optionId);

		// setTimeout の処理待ち
		await vi.waitFor(
			() => {
				expect(scrollIntoViewMock).toHaveBeenCalled();
			},
			{ timeout: 500 },
		);
	});
});
