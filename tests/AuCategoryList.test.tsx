import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuCategoryList } from "../src/feature/AuCategoryList";
import { auOptionMetaData, resetAuOptionMetaData } from "../src/logics/api";
import type { AuOptionId } from "../src/type";
import { useStore } from "../src/useStore";

describe("AuCategoryList", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetViewer();
	});

	it("renders standard category items for Tab 0", () => {
		auOptionMetaData.tabCategoryMap = { 0: [1], 1: [], 2: [] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "General Settings", options: [] },
		};
		useStore.getState().setSelectedAuTabId(0);

		render(<AuCategoryList />);

		expect(screen.getByText("General Settings")).toBeInTheDocument();
		expect(screen.getByTestId("au-category-1")).toBeInTheDocument();
	});

	it("renders role category items for Tab 1", () => {
		const chanceId = 101 as unknown as AuOptionId;
		const countId = 102 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [], 1: [2], 2: [] };
		auOptionMetaData.categoryMetaData = {
			2: { name: "Scientist", options: [chanceId, countId] },
		};
		auOptionMetaData.options[chanceId] = {
			title: "C",
			format: "",
			range: [0, 100],
		};
		auOptionMetaData.options[countId] = {
			title: "M",
			format: "",
			range: [0, 1],
		};

		useStore.getState().setSelectedAuTabId(1);
		useStore.getState().setAuValue({ [chanceId]: 1, [countId]: 1 });

		render(<AuCategoryList />);

		expect(screen.getByText("Scientist")).toBeInTheDocument();
		expect(screen.getByTestId("au-chance-control")).toBeInTheDocument();
		expect(screen.getByTestId("au-max-count-control")).toBeInTheDocument();
	});

	it("disables accordion button when chance is 0", () => {
		const chanceId = 101 as unknown as AuOptionId;
		const countId = 102 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 1: [2] };
		auOptionMetaData.categoryMetaData = {
			2: { name: "Scientist", options: [chanceId, countId] },
		};
		auOptionMetaData.options[chanceId] = {
			title: "C",
			format: "",
			range: [0, 100],
		};
		auOptionMetaData.options[countId] = {
			title: "M",
			format: "",
			range: [0, 1],
		};

		useStore.getState().setSelectedAuTabId(1);
		useStore.getState().setAuValue({ [chanceId]: 0, [countId]: 0 });

		render(<AuCategoryList />);

		const button = screen.getByRole("button", { name: /Scientist/ });
		expect(button).toBeDisabled();
	});

	it("filters out first two options from role category body", async () => {
		const chanceId = 101 as unknown as AuOptionId;
		const countId = 102 as unknown as AuOptionId;
		const otherId = 103 as unknown as AuOptionId;

		auOptionMetaData.tabCategoryMap = { 1: [2] };
		auOptionMetaData.categoryMetaData = {
			2: { name: "Scientist", options: [chanceId, countId, otherId] },
		};
		auOptionMetaData.options[chanceId] = {
			title: "Chance",
			format: "",
			range: [0, 100],
		};
		auOptionMetaData.options[countId] = {
			title: "MaxCount",
			format: "",
			range: [0, 1],
		};
		auOptionMetaData.options[otherId] = {
			title: "Other Option",
			format: "",
			range: [0, 1],
		};

		useStore.getState().setSelectedAuTabId(1);
		useStore
			.getState()
			.setAuValue({ [chanceId]: 1, [countId]: 1, [otherId]: 0 });

		render(<AuCategoryList />);

		const toggleButton = screen.getByRole("button", { name: /Scientist/ });
		fireEvent.click(toggleButton);

		expect(screen.getByText("Other Option")).toBeInTheDocument();
		expect(screen.queryByText("Chance")).not.toBeInTheDocument();
		expect(screen.queryByText("MaxCount")).not.toBeInTheDocument();
	});
});
