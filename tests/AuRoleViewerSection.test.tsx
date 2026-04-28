import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuRoleViewerSection } from "../src/feature/rightsidepanel/AuRoleViewerSection";
import { auOptionMetaData, resetAuOptionMetaData } from "../src/logics/api";
import { useStore } from "../src/useStore";

describe("AuRoleViewerSection", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		useStore.getState().resetAll();
	});

	it("filters and renders active roles only", () => {
		const tabId = 1;
		const activeCategoryId = 10;
		const inactiveCategoryId = 11;

		const activeChanceId = 101 as any;
		const activeCountId = 102 as any;
		const inactiveChanceId = 201 as any;
		const inactiveCountId = 202 as any;

		auOptionMetaData.tabCategoryMap[tabId] = [activeCategoryId, inactiveCategoryId];

		auOptionMetaData.categoryMetaData[activeCategoryId] = {
			name: "Active Role",
			options: [activeChanceId, activeCountId],
		};
		auOptionMetaData.categoryMetaData[inactiveCategoryId] = {
			name: "Inactive Role",
			options: [inactiveChanceId, inactiveCountId],
		};

		auOptionMetaData.options[activeChanceId] = { title: "C", format: "", range: [0, 100] };
		auOptionMetaData.options[activeCountId] = { title: "M", format: "", range: [0, 1] };
		auOptionMetaData.options[inactiveChanceId] = { title: "C", format: "", range: [0, 100] };
		auOptionMetaData.options[inactiveCountId] = { title: "M", format: "", range: [0, 1] };

		useStore.getState().setAuValue({
			[activeChanceId]: 1, // 100
			[activeCountId]: 1, // 1
			[inactiveChanceId]: 0, // 0
			[inactiveCountId]: 1, // 1
		});

		render(
			<AuRoleViewerSection
				tabId={tabId}
				title="Crew Roles"
				isOpen={true}
				onToggle={() => {}}
			/>
		);

		expect(screen.getByText("Active Role")).toBeInTheDocument();
		expect(screen.queryByText("Inactive Role")).not.toBeInTheDocument();
	});

	it("returns null if no active roles", () => {
		const tabId = 1;
		auOptionMetaData.tabCategoryMap[tabId] = [];

		const { container } = render(
			<AuRoleViewerSection
				tabId={tabId}
				title="Crew Roles"
				isOpen={true}
				onToggle={() => {}}
			/>
		);

		expect(container.firstChild).toBeNull();
	});
});
