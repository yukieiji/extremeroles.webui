import { Badge } from "@/components/ui/badge";
import { ColoredText } from "@/components/parts/ColoredText";
import { Separator } from "@/components/ui/separator";
import { TYPOGRAPHY } from "@/designConstants";
import type { LobbyInfo } from "@/type";

interface LobbyInfoViewProps {
	lobbyInfo: LobbyInfo | null;
}

export function LobbyInfoView({ lobbyInfo }: LobbyInfoViewProps) {
	return (
		<>
			<span className={`${TYPOGRAPHY.LABEL} text-text-primary mx-auto pt-4`}>
				ロビー情報
			</span>
			<Separator />
			<div className="flex-1 flex flex-col gap-2 overflow-hidden py-2">
				<div className="flex flex-col gap-3 h-full overflow-hidden">
					{lobbyInfo?.Online && (
						<>
							<div className="flex flex-col">
								<span className={`${TYPOGRAPHY.SMALL} text-text-secondary`}>
									サーバー
								</span>
								<ColoredText
									text={lobbyInfo.Online.Server}
									className={TYPOGRAPHY.CHILD_LABEL}
								/>
							</div>
							<div className="flex flex-col">
								<span className={`${TYPOGRAPHY.SMALL} text-text-secondary`}>
									ルームコード
								</span>
								<span
									className={`${TYPOGRAPHY.CHILD_LABEL} break-all font-mono`}
								>
									{lobbyInfo.Online.Code}
								</span>
							</div>
						</>
					)}
					<div className="flex-1 flex flex-col overflow-hidden">
						<span className={`${TYPOGRAPHY.SMALL} text-text-secondary mb-1`}>
							現在のプレイヤー
						</span>
						<div className="flex-1 overflow-y-auto pr-1">
							<div className="flex flex-wrap gap-1 items-start">
								{lobbyInfo?.CurrentPlayerNames.map((name) => (
									<Badge
										key={name}
										variant="outline"
										className="bg-background/50"
									>
										{name}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
