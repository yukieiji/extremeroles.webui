import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SimulateResultCard } from "@/feature/exr/SimulateResultCard";
import { translationMetaData } from "@/logics/api";
import type { SimulateResult } from "@/type";

describe("SimulateResultCard", () => {
	const mockResult: SimulateResult = {
		CycleData: [
			{ PlayerName: "Player1", RoleName: "CrewmateRole", Team: "Crewmate" },
			{ PlayerName: "Player2", RoleName: "ImpostorRole", Team: "Impostor" },
			{ PlayerName: "Player3", RoleName: "NeutralRole", Team: "Neutral" },
		],
	};

	beforeEach(() => {
		// translationMetaData のセットアップ
		translationMetaData.Crewmate = "クルー陣営";
		translationMetaData.Impostor = "インポスター陣営";
		translationMetaData.Neutral = "第三陣営";
		translationMetaData.CrewmateRole = "クルー";
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
				{ PlayerName: "Player1", RoleName: "RoleA", Team: "Crewmate" },
				{ PlayerName: "Player1", RoleName: "RoleB", Team: "Crewmate" },
			],
		};
		translationMetaData.Crewmate = "チーム1";
		translationMetaData.RoleA = "役職A";
		translationMetaData.RoleB = "役職B";

		render(<SimulateResultCard result={multipleRolesResult} index={0} />);

		expect(screen.getByText("役職A + 役職B")).toBeInTheDocument();
	});

	it("copies result to clipboard when copy button is clicked", async () => {
		translationMetaData.Crewmate = "クルー陣営";
		translationMetaData.CrewmateRole = "クルー";
		const copyMockResult: SimulateResult = {
			CycleData: [
				{ PlayerName: "Player1", RoleName: "CrewmateRole", Team: "Crewmate" },
			],
		};
		render(<SimulateResultCard result={copyMockResult} index={0} />);

		const copyButton = screen.getByRole("button", { name: /コピー/i });
		fireEvent.click(copyButton);

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			expect.stringContaining("### シミュレート結果"),
		);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			expect.stringContaining("- クルー陣営\n   - Player1: クルー"),
		);
	});

	it("handles team name translation fallback", () => {
		const fallbackResult: SimulateResult = {
			CycleData: [
				{ PlayerName: "Player1", RoleName: "CrewmateRole", Team: "Liberal" },
			],
		};
		// translationMetaData.Liberal は未定義にする
		delete translationMetaData.Liberal;

		render(<SimulateResultCard result={fallbackResult} index={0} />);

		expect(screen.getByText("Liberal")).toBeInTheDocument();
	});

	it("has correct classes for layout alignment", () => {
		render(<SimulateResultCard result={mockResult} index={0} />);

		// プレイヤーネームのセルが w-[60%] と whitespace-normal を持っていることを確認
		const playerNameCell = screen.getByText("Player1");
		expect(playerNameCell).toHaveClass("w-[60%]");
		expect(playerNameCell).toHaveClass("whitespace-normal");

		// 役職のセルが whitespace-normal を持っていることを確認
		const roleCell = screen.getByText("クルー");
		const roleTableCell = roleCell.closest("td");
		expect(roleTableCell).toHaveClass("whitespace-normal");
	});
});
