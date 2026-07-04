import { LoadingCycle } from "../parts/LoadingCycle";

export function LobbyLoadingView() {
	return (
		<div className="flex flex-col items-center justify-center py-4">
			<LoadingCycle />
		</div>
	);
}
