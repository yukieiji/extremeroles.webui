import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RoleSummarySection } from "@/feature/rightsidepanel/summary/RoleSummarySection";
import {
	auOptionMetaData,
	exrOptionMetaData,
	resetAuOptionMetaData,
	resetExrOptionMetaData,
} from "@/logics/api";
import {
	getAuOptionId,
	getUniqueOptionId,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import {
	AU_PREFIX,
	ExRTabId,
	OptionValueType,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
} from "@/type";
import { useStore } from "@/useStore";

describe("RoleSummarySection", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		resetExrOptionMetaData();
		useStore.setState({
			auValue: {},
			exrValue: {},
		});
	});

	it("renders nothing when no roles are active", () => {
		const { container } = render(<RoleSummarySection />);
		expect(container.firstChild).toBeNull();
	});

	it("renders only vanilla roles when only vanilla roles are active", () => {
		const catId = VANILLA_ROLE_CATEGORY_IDS[0];
		const chanceId = getAuOptionId(
			100,
			OptionValueType.RoleBase,
			AU_PREFIX.CHANCE,
		);
		const maxCountId = getAuOptionId(
			100,
			OptionValueType.RoleBase,
			AU_PREFIX.MAX_COUNT,
		);

		auOptionMetaData.categoryMetaData[catId] = {
			name: "Vanilla Role",
			options: [chanceId, maxCountId],
			tabId: 1,
		};
		auOptionMetaData.options[chanceId] = {
			title: "Chance",
			format: "",
			range: [0, 50, 100],
			tabId: 1,
			categoryId: catId,
		};
		auOptionMetaData.options[maxCountId] = {
			title: "Max Count",
			format: "",
			range: [0, 1, 2],
			tabId: 1,
			categoryId: catId,
		};

		useStore.setState({
			auValue: {
				[chanceId]: 1, // 50
				[maxCountId]: 1, // 1
			},
		});

		render(<RoleSummarySection />);

		expect(screen.getByText("Vanilla Role")).toBeInTheDocument();
		expect(screen.queryByRole("separator")).not.toBeInTheDocument();
	});

	it("renders only ExR roles when only ExR roles are active", () => {
		const tabId = ExRTabId.CrewmateTab;
		const catId = 100;
		const chanceId = getUniqueOptionId(tabId, catId, SPAWN_RATE_OPTION_ID);
		const countId = getUniqueOptionId(tabId, catId, SPAWN_COUNT_OPTION_ID);

		exrOptionMetaData.tabs[tabId] = {
			name: "Crewmate",
			categoryIds: [catId],
			colors: [],
		};
		exrOptionMetaData.categories[catId] = {
			name: "ExR Role",
			tabId: tabId,
			categoryColors: [],
		};

		useStore.setState({
			exrValue: {
				[chanceId]: { selection: 1, values: [0, 50, 100] },
				[countId]: { selection: 1, values: [0, 1, 2] },
			},
		});

		render(<RoleSummarySection />);

		expect(screen.getByText("ExR Role")).toBeInTheDocument();
		expect(screen.queryByRole("separator")).not.toBeInTheDocument();
	});

	it("renders separator when both vanilla and ExR roles are active", () => {
		// Vanilla setup
		const vCatId = VANILLA_ROLE_CATEGORY_IDS[0];
		const vChanceId = getAuOptionId(
			100,
			OptionValueType.RoleBase,
			AU_PREFIX.CHANCE,
		);
		const vMaxCountId = getAuOptionId(
			100,
			OptionValueType.RoleBase,
			AU_PREFIX.MAX_COUNT,
		);
		auOptionMetaData.categoryMetaData[vCatId] = {
			name: "Vanilla Role",
			options: [vChanceId, vMaxCountId],
			tabId: 1,
		};
		auOptionMetaData.options[vChanceId] = {
			title: "Chance",
			format: "",
			range: [0, 50, 100],
			tabId: 1,
			categoryId: vCatId,
		};
		auOptionMetaData.options[vMaxCountId] = {
			title: "Max Count",
			format: "",
			range: [0, 1, 2],
			tabId: 1,
			categoryId: vCatId,
		};

		// ExR setup
		const eTabId = ExRTabId.CrewmateTab;
		const eCatId = 200;
		const eChanceId = getUniqueOptionId(eTabId, eCatId, SPAWN_RATE_OPTION_ID);
		const eCountId = getUniqueOptionId(eTabId, eCatId, SPAWN_COUNT_OPTION_ID);
		exrOptionMetaData.tabs[eTabId] = {
			name: "Crewmate",
			categoryIds: [eCatId],
			colors: [],
		};
		exrOptionMetaData.categories[eCatId] = {
			name: "ExR Role",
			tabId: eTabId,
			categoryColors: [],
		};

		useStore.setState({
			auValue: {
				[vChanceId]: 1,
				[vMaxCountId]: 1,
			},
			exrValue: {
				[eChanceId]: { selection: 1, values: [0, 50, 100] },
				[eCountId]: { selection: 1, values: [0, 1, 2] },
			},
		});

		render(<RoleSummarySection />);

		expect(screen.getByText("Vanilla Role")).toBeInTheDocument();
		expect(screen.getByText("ExR Role")).toBeInTheDocument();
		expect(screen.getByRole("separator")).toBeInTheDocument();
	});
});
