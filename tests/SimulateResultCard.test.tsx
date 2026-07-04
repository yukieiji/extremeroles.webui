import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { SimulateResultCard } from "@/feature/exr/SimulateResultCard";
import { translationMetaData } from "@/logics/api";
import type { SimulateResult } from "@/type";

describe("SimulateResultCard", () => {
	const mockResult: SimulateResult = {
		CycleData: [
			{ PlayerName: "Player1", RoleName: "Crewmate", Team: "TeamCrew" },
			{ PlayerName: "Player2", RoleName: "ImpostorRole", Team: "TeamImpostor" },
			{ PlayerName: "Player3", RoleName: "NeutralRole", Team: "TeamNeutral" },
		],
	};

	beforeEach(() => {
		// translationMetaData のセットアップ
		translationMetaData.TeamCrew = "クルー陣営";
		translationMetaData.TeamImpostor = "インポスター陣営";
		translationMetaData.TeamNeutral = "第三陣営";
		translationMetaData.Crewmate = "クルー";
		translationMetaData.ImpostorRole = "インポスター";
		translationMetaData.NeutralRole = "ニュートラル";

		// navigator.clipboard のモック
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn().mockImplementation(() => Promise.resolve()),
			},
		});
	});

	it("renders result index correctly", () => {
		render(<SimulateResultCard result={mockResult} index={0} />);
		expect(screen.getByText("結果 1")).toBeInTheDocument();
	});

	it("renders player names and roles correctly", () => {
		render(<SimulateResultCard result={mockResult} index={0} />);

		expect(screen.getByText("Player1")).toBeInTheDocument();
		expect(screen.getByText("Player2")).toBeInTheDocument();
		expect(screen.getByText("Player3")).toBeInTheDocument();

		expect(screen.getByText("クルー")).toBeInTheDocument();
		expect(screen.getByText("ニュートラル")).toBeInTheDocument();
	});

	it("renders team names correctly", () => {
		render(<SimulateResultCard result={mockResult} index={0} />);

		expect(screen.getByText("クルー陣営")).toBeInTheDocument();
		expect(screen.getByText("インポスター陣営")).toBeInTheDocument();
		expect(screen.getByText("第三陣営")).toBeInTheDocument();
	});

	it("handles multiple roles for a single player", () => {
		const multipleRolesResult: SimulateResult = {
			CycleData: [
				{ PlayerName: "Player1", RoleName: "RoleA", Team: "Team1" },
				{ PlayerName: "Player1", RoleName: "RoleB", Team: "Team1" },
			],
		};
		translationMetaData.Team1 = "チーム1";
		translationMetaData.RoleA = "役職A";
		translationMetaData.RoleB = "役職B";

		render(<SimulateResultCard result={multipleRolesResult} index={0} />);

		expect(screen.getByText("役職A + 役職B")).toBeInTheDocument();
	});

	it("copies result to clipboard when copy button is clicked", async () => {
		render(<SimulateResultCard result={mockResult} index={0} />);

		const copyButton = screen.getByRole("button", { name: /コピー/i });
		fireEvent.click(copyButton);

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			expect.stringContaining("### シミュレート結果")
		);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			expect.stringContaining("- クルー陣営\n   - Player1: クルー")
		);
	});

	it("handles team name translation fallback", () => {
		const unknownTeamResult: SimulateResult = {
			CycleData: [
				{ PlayerName: "Player1", RoleName: "Crewmate", Team: "UnknownTeam" },
			],
		};
		render(<SimulateResultCard result={unknownTeamResult} index={0} />);

		expect(screen.getByText("UnknownTeam")).toBeInTheDocument();
	});
});
