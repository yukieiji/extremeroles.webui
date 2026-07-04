import { ColoredText } from "@/components/parts/ColoredText";
import { LobbyInfoViewItemLayout } from "@/components/parts/LobbyInfoViewItemLayout";
import { Badge } from "@/components/ui/badge";
import { TYPOGRAPHY } from "@/designConstants";
import type { LobbyInfo } from "@/type";

interface LobbyInfoViewProps {
	lobbyInfo: LobbyInfo | null;
}

export function LobbyInfoView({ lobbyInfo }: LobbyInfoViewProps) {
	return (
		<div className="flex flex-col gap-2 flex-1 overflow-hidden py-2">
			<div className="flex flex-col gap-2 h-full overflow-hidden">
				{lobbyInfo?.Online && (
					<>
						<LobbyInfoViewItemLayout title={"サーバー"}>
							<ColoredText
								text={lobbyInfo.Online.Server}
								className={TYPOGRAPHY.CHILD_LABEL}
							/>
						</LobbyInfoViewItemLayout>
						<LobbyInfoViewItemLayout title={"ルームコード"}>
							<span className={`${TYPOGRAPHY.CHILD_LABEL} break-all`}>
								{lobbyInfo.Online.Code}
							</span>
						</LobbyInfoViewItemLayout>
					</>
				)}
				<div className="flex-1 flex flex-col overflow-hidden">
					<span className={`${TYPOGRAPHY.SMALL} text-text-secondary py-2`}>
						現在のプレイヤー
					</span>
					<div className="flex-1 overflow-y-auto">
						<div className="flex flex-wrap gap-1 items-start">
							{lobbyInfo?.CurrentPlayerNames.map((name) => (
								<Badge key={name} variant="default">
									{name}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
