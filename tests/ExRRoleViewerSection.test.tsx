import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExRRoleViewerSection } from "../src/feature/rightsidepanel/ExRRoleViewerSection";
import { exrOptionMetaData, resetExrOptionMetaData } from "../src/logics/api";
import { getUniqueOptionId } from "../src/logics/optionUtils";
import type { OptionTab } from "../src/type";
import { useStore } from "../src/useStore";

describe("ExRRoleViewerSection Component", () => {
	it("renders active roles correctly", async () => {
		resetExrOptionMetaData();

		const tabId = 1; // CrewmateTab
		const categoryId = 10;
		const roleName = "Test Role";

		exrOptionMetaData.tabs[tabId as OptionTab] = {
			name: "Crewmate Roles",
			categoryIds: [categoryId],
		};
		exrOptionMetaData.categories[categoryId] = {
			name: roleName,
			tabId: tabId as OptionTab,
		};

		const rateId = getUniqueOptionId(tabId, categoryId, 50);
		const countId = getUniqueOptionId(tabId, categoryId, 51);

		exrOptionMetaData.options[rateId] = {
			metaData: { translatedName: "Rate", format: "{0}%", type: "Int32" },
			childOptionIds: [],
		};
		exrOptionMetaData.options[countId] = {
			metaData: { translatedName: "Count", format: "{0}", type: "Int32" },
			childOptionIds: [],
		};

		useStore.setState({
			exrValue: {
				[rateId]: { selection: 1, values: [0, 50, 100] },
				[countId]: { selection: 1, values: [0, 1, 2] },
			},
			openedExRRoleTabIds: { [tabId]: true },
		});

		render(
			<ExRRoleViewerSection
				tabId={tabId}
				title="Crewmate Roles"
				isOpen={true}
				onToggle={() => {}}
			/>,
		);

		expect(screen.getByText(roleName)).toBeInTheDocument();
		expect(screen.getByText("50%")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("does not render when no active roles", () => {
		resetExrOptionMetaData();
		const tabId = 1;

		useStore.setState({
			exrValue: {},
		});

		const { container } = render(
			<ExRRoleViewerSection
				tabId={tabId}
				title="Crewmate Roles"
				isOpen={true}
				onToggle={() => {}}
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});
