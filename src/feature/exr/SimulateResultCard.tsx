import { Copy } from "lucide-react";
import { ColoredText } from "@/components/parts/ColoredText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { stripColorTags } from "@/logics/colorUtils";
import type { SimulateResult } from "@/type";

interface SimulateResultCardProps {
	result: SimulateResult;
	index: number;
}

const TEAM_ORDER = ["Null", "Crewmate", "Impostor", "Neutral", "Liberal"];

export function SimulateResultCard({ result, index }: SimulateResultCardProps) {
	// チームごとにグループ化し、さらにプレイヤー名でグループ化（複数役職対応）
	const teamGroups = result.CycleData.reduce(
		(acc, data) => {
			const team = data.Team;
			if (!acc[team]) {
				acc[team] = {};
			}
			if (!acc[team][data.PlayerName]) {
				acc[team][data.PlayerName] = [];
			}
			acc[team][data.PlayerName].push(data.RoleName);
			return acc;
		},
		{} as Record<string, Record<string, string[]>>,
	);

	// 定義された順序に従ってチームを抽出（存在するチームのみ）
	const sortedTeams = TEAM_ORDER.filter((team) => teamGroups[team]);
	// もしTEAM_ORDERに含まれないチームがあれば最後に追加する（基本的にはないはずだが安全のため）
	// Noneは排除する
	const otherTeams = Object.keys(teamGroups).filter(
		(team) => !TEAM_ORDER.includes(team) && team !== "None",
	);
	const finalTeams = [...sortedTeams, ...otherTeams];

	const handleCopy = () => {
		let text = "### シミュレート結果\n";
		for (const team of finalTeams) {
			const players = teamGroups[team];
			const teamName =
				team === "Null" ? "" : translationMetaData[team] || team;
			text += teamName ? `- ${teamName}\n` : "";
			for (const [playerName, roles] of Object.entries(players)) {
				text += `   - ${playerName}: ${roles.map((x) => stripColorTags(translationMetaData[x])).join(" + ")}\n`;
			}
		}
		navigator.clipboard.writeText(text.trim());
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className={TYPOGRAPHY.LABEL}>結果 {index + 1}</CardTitle>
				<Button variant="outline" size="sm" onClick={handleCopy}>
					<Copy className="w-4 h-4" />
					コピー
				</Button>
			</CardHeader>
			<CardContent>
				{finalTeams.map((team) => {
					const players = teamGroups[team];
					if (Object.keys(players).length === 0) {
						return null;
					}
					const teamName =
						team === "Null" ? "" : translationMetaData[team] || team;

					return (
						<div key={team} className="mb-2 last:mb-0">
							{teamName && (
								<h4 className={`${TYPOGRAPHY.LABEL} mb-1`}>{teamName}</h4>
							)}
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>プレイヤーネーム</TableHead>
										<TableHead>役職</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Object.entries(players).map(([playerName, roles]) => (
										<TableRow key={playerName}>
											<TableCell>{playerName}</TableCell>
											<TableCell>
												<ColoredText
													text={roles
														.map((x) => translationMetaData[x])
														.join(" + ")}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
