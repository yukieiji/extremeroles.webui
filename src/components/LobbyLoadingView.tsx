import { TYPOGRAPHY } from "@/designConstants";
import { LoadingCycle } from "./parts/LoadingCycle";

export function LobbyLoadingView() {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<LoadingCycle />
			<p className={`${TYPOGRAPHY.SMALL} font-semibold text-text-primary mt-2`}>
				Loading Lobby Info...
			</p>
		</div>
	);
}
