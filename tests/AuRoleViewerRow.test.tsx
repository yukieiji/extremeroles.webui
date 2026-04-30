import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuRoleViewerRow } from "../src/feature/rightsidepanel/AuRoleViewerRow";
import { auOptionMetaData, resetAuOptionMetaData } from "../src/logics/api";
import type { AuOptionId } from "../src/type";
import { useStore } from "../src/useStore";

describe("AuRoleViewerRow", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetAll();
	});

	it("renders role name and stats correctly", () => {
		const categoryId = 10;
		const chanceId = 101 as unknown as AuOptionId;
		const maxCountId = 102 as unknown as AuOptionId;

		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Sheriff",
			options: [chanceId, maxCountId],
		};
		auOptionMetaData.options[chanceId] = {
			title: "Chance",
			format: "{0}%",
			range: [0, 50, 100],
		};
		auOptionMetaData.options[maxCountId] = {
			title: "MaxCount",
			format: "{0}",
			range: [0, 1, 2],
		};

		useStore.getState().setAuValue({
			[chanceId]: 1, // 50
			[maxCountId]: 2, // 2
		});

		render(<AuRoleViewerRow tabId={1} categoryId={categoryId} />);

		expect(screen.getByText("Sheriff")).toBeInTheDocument();
		// コンポーネントの実装では <span>{chanceValue.toString()}%</span> となっており、
		// toString() と % が同一テキストノードになる場合がある
		expect(screen.getByText(/50%/)).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("calls navigateToOption on double click", () => {
		const categoryId = 10;
		const chanceId = 101 as unknown as AuOptionId;
		const maxCountId = 102 as unknown as AuOptionId;

		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Sheriff",
			options: [chanceId, maxCountId],
		};
		auOptionMetaData.options[chanceId] = {
			title: "Chance",
			format: "{0}%",
			range: [50],
		};
		auOptionMetaData.options[maxCountId] = {
			title: "MaxCount",
			format: "{0}",
			range: [1],
		};

		useStore.getState().setAuValue({
			[chanceId]: 0,
			[maxCountId]: 0,
		});

		const setSelectedTabSpy = vi.spyOn(useStore.getState(), "setSelectedTab");

		render(<AuRoleViewerRow tabId={1} categoryId={categoryId} />);

		const button = screen.getByRole("button");
		fireEvent.doubleClick(button);

		expect(setSelectedTabSpy).toHaveBeenCalledWith("Au");
		expect(useStore.getState().selectedAuTabId).toBe(1);
	});
});
