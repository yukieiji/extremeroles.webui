import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RolePin } from "../src/components/parts/RolePin";
import { RoleFilterCard } from "../src/feature/exr/RoleFilterCard";
import { RoleFilterViewer } from "../src/feature/exr/RoleFilterViewer";
import type { RoleFilterItem } from "../src/type";
import { useStore } from "../src/useStore";

vi.mock("../src/useStore");

describe("RolePin", () => {
	it("renders the role name", () => {
		render(<RolePin name="Sheriff" />);
		expect(screen.getByText("Sheriff")).toBeDefined();
	});

	it("renders with color tags", () => {
		render(<RolePin name="<color=#FF0000>Red Role</color>" />);
		const span = screen.getByText("Red Role");
		expect(span).toBeDefined();
		expect(span.getAttribute("style")).toContain("color: rgb(255, 0, 0)");
	});
});

describe("RoleFilterCard", () => {
	const mockFilter: RoleFilterItem = {
		guid: "test-guid",
		assignNum: 2,
		roles: [
			{ id: 1, name: "Sheriff", type: "Normal" },
			{ id: 2, name: "Lover", type: "Combination" },
		],
	};

	it("renders assignNum and roles", () => {
		render(<RoleFilterCard filter={mockFilter} />);
		expect(screen.getByText("2")).toBeDefined();
		expect(screen.getByText("Sheriff")).toBeDefined();
		expect(screen.getByText("Lover")).toBeDefined();
	});
});

describe("RoleFilterViewer", () => {
	it("renders 'No data' message when roleFilterList is null", () => {
		vi.mocked(useStore).mockReturnValue(null);
		render(<RoleFilterViewer />);
		expect(screen.getByText("No role filter data available.")).toBeDefined();
	});

	it("renders list of cards when roleFilterList is provided", () => {
		const mockList: RoleFilterItem[] = [
			{
				guid: "guid-1",
				assignNum: 1,
				roles: [{ id: 1, name: "Role 1", type: "Normal" }],
			},
			{
				guid: "guid-2",
				assignNum: 3,
				roles: [{ id: 2, name: "Role 2", type: "Normal" }],
			},
		];
		vi.mocked(useStore).mockReturnValue(mockList);
		render(<RoleFilterViewer />);
		expect(screen.getByText("Role 1")).toBeDefined();
		expect(screen.getByText("Role 2")).toBeDefined();
		expect(screen.getAllByText("AssignNum")).toHaveLength(2);
	});
});
