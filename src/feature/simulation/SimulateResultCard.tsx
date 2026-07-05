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
import {
	COPY_BUTTON_LABEL,
	PLAYER_NAME_HEADER,
	RESULT_TITLE,
	ROLE_NAME_HEADER,
	SIMULATE_RESULT_HEADER,
} from "@/noTrans";
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
	const finalTeams = TEAM_ORDER.filter((team) => teamGroups[team]);

	const handleCopy = () => {
		let text = SIMULATE_RESULT_HEADER;
		for (const team of finalTeams) {
			const players = teamGroups[team];
			const teamName = team === "Null" ? "" : translationMetaData[team] || team;
			text += teamName ? `- ${teamName}\n` : "";
			for (const [playerName, roles] of Object.entries(players)) {
				text += `   - ${playerName}: ${roles.map((x) => stripColorTags(translationMetaData[x] ?? x)).join(" + ")}\n`;
			}
		}
		navigator.clipboard.writeText(text.trim());
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className={TYPOGRAPHY.LABEL}>
					{RESULT_TITLE} {index + 1}
				</CardTitle>
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopy}
					className="shadow-md"
				>
					<Copy className="w-4 h-4" />
					{COPY_BUTTON_LABEL}
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
								<TableHeader className={TYPOGRAPHY.CHILD_LABEL}>
									<TableRow>
										<TableHead className="w-[60%] whitespace-normal">
											{PLAYER_NAME_HEADER}
										</TableHead>
										<TableHead className="whitespace-normal">
											{ROLE_NAME_HEADER}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className={TYPOGRAPHY.SMALL}>
									{Object.entries(players).map(([playerName, roles]) => (
										<TableRow key={playerName}>
											<TableCell className="w-[60%] whitespace-normal">
												{playerName}
											</TableCell>
											<TableCell className="whitespace-normal">
												<ColoredText
													text={roles
														.map((x) => translationMetaData[x] || x)
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
