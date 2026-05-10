import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuCategoryList } from "@/feature/amongus/AuCategoryList";
import { auOptionMetaData, resetAuOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

describe("AuCategoryList", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetViewer();
	});

	it("renders MapDropDown for the first category of Tab 0", async () => {
		const user = userEvent.setup();
		const mapOptionId = 100 as unknown as AuOptionId;
		auOptionMetaData.tabCategoryMap = { 0: [1], 1: [], 2: [] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Map Category", options: [mapOptionId] },
		};
		auOptionMetaData.options[mapOptionId] = {
			title: "Map",
			format: "",
			range: ["The Skeld", "Mira HQ"],
		};
		await act(async () => {
			useStore.getState().setSelectedAuTabId(0);
		});

		await act(async () => {
			render(<AuCategoryList />);
		});

		const map = screen.getByText("Map");
		expect(map).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Map Category" }),
		).not.toBeInTheDocument();

		// Should show current map name in dropdown
		expect(screen.getByText("The Skeld")).toBeInTheDocument();

		// Open dropdown to see other options
		const trigger = screen.getByRole("combobox");
		await user.click(trigger);
		expect(
			await screen.findByRole("option", { name: "Mira HQ" }),
		).toBeInTheDocument();
	});

	it("renders standard category items for Tab 0 other than the first", async () => {
		auOptionMetaData.tabCategoryMap = { 0: [1, 2], 1: [], 2: [] };
		auOptionMetaData.categoryMetaData = {
			1: { name: "Map Category", options: [] },
			2: { name: "Other Category", options: [100 as unknown as AuOptionId] },
		};
		auOptionMetaData.options[100 as unknown as AuOptionId] = {
			title: "Map",
			format: "",
			range: ["The Skeld"],
		};
		await act(async () => {
			useStore.getState().setSelectedAuTabId(0);
		});

		await act(async () => {
			render(<AuCategoryList />);
		});

		expect(screen.getByText("Other Category")).toBeInTheDocument();
	});

	it("renders role category items for Tab 1", async () => {
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

		await act(async () => {
			useStore.getState().setSelectedAuTabId(1);
			useStore.getState().setAuValue({ [chanceId]: 1, [countId]: 1 });
		});

		await act(async () => {
			render(<AuCategoryList />);
		});

		expect(screen.getByText("Scientist")).toBeInTheDocument();
		expect(screen.getByTestId("spawn-rate-control")).toBeInTheDocument();
		expect(screen.getByTestId("spawn-count-control")).toBeInTheDocument();
	});

	it("disables accordion button when chance is 0", async () => {
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

		await act(async () => {
			useStore.getState().setSelectedAuTabId(1);
			useStore.getState().setAuValue({ [chanceId]: 0, [countId]: 0 });
		});

		await act(async () => {
			render(<AuCategoryList />);
		});

		const button = screen.getByRole("button", { name: /Scientist/ });
		expect(button).toHaveAttribute("aria-disabled", "true");
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

		await act(async () => {
			useStore.getState().setSelectedAuTabId(1);
			useStore
				.getState()
				.setAuValue({ [chanceId]: 1, [countId]: 1, [otherId]: 0 });
		});

		await act(async () => {
			render(<AuCategoryList />);
		});

		const toggleButton = screen.getByRole("button", { name: /Scientist/ });
		await act(async () => {
			fireEvent.click(toggleButton);
		});

		expect(screen.getByText("Other Option")).toBeInTheDocument();
		expect(screen.queryByText("Chance")).not.toBeInTheDocument();
		expect(screen.queryByText("MaxCount")).not.toBeInTheDocument();
	});
});
