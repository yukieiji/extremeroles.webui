import { TYPOGRAPHY } from "@/designConstants";
import { LoadingCycle } from "../parts/LoadingCycle";

/**
 * ローディング画面
 */
export function LoadingView() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-app-background z-50">
			<div className="flex flex-col items-center">
				<LoadingCycle />
				<p className={`${TYPOGRAPHY.LABEL} font-semibold text-text-primary`}>
					Loading data...
				</p>
			</div>
		</div>
	);
}
