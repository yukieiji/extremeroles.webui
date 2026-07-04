import { Copy } from "lucide-react";
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
import type { SimulateResult } from "@/type";

interface SimulateResultCardProps {
	result: SimulateResult;
	index: number;
}

export function SimulateResultCard({ result, index }: SimulateResultCardProps) {
	// チームごとにグループ化し、さらにプレイヤー名でグループ化（複数役職対応）
	const teamGroups = result.CycleData.reduce(
		(acc, data) => {
			const team = data.Team || "None";
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

	const handleCopy = () => {
		let text = "";
		for (const [team, players] of Object.entries(teamGroups)) {
			if (team === "None") {
				continue;
			}
			const teamName = translationMetaData[team] || team;
			text += `- ${teamName}\n`;
			for (const [playerName, roles] of Object.entries(players)) {
				text += `   - ${playerName}: ${roles.join(" + ")}\n`;
			}
		}
		navigator.clipboard.writeText(text.trim());
	};

	return (
		<Card className="mb-4">
			<CardHeader className="flex flex-row items-center justify-between py-2">
				<CardTitle className={TYPOGRAPHY.LABEL}>結果 {index + 1}</CardTitle>
				<Button variant="outline" size="sm" onClick={handleCopy}>
					<Copy className="w-4 h-4 mr-2" />
					コピー
				</Button>
			</CardHeader>
			<CardContent>
				{Object.entries(teamGroups).map(([team, players]) => {
					if (team === "None" && Object.keys(players).length === 0) {
						return null;
					}
					const teamName =
						team === "None" ? "" : translationMetaData[team] || team;

					return (
						<div key={team} className="mb-4 last:mb-0">
							{teamName && (
								<h4 className={`${TYPOGRAPHY.CHILD_LABEL} mb-2`}>{teamName}</h4>
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
											<TableCell>{roles.join(" + ")}</TableCell>
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
