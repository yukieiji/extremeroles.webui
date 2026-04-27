import { LoadingCycle } from "../parts/LoadingCycle";

/**
 * ローディング画面
 */
export function LoadingView() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
			<div className="flex flex-col items-center gap-4">
				<LoadingCycle />
				<p className="text-xl font-semibold text-gray-700">Loading data...</p>
			</div>
		</div>
	);
}
