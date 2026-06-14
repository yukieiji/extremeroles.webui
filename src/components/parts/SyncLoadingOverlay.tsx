import { TYPOGRAPHY } from "@/designConstants";
import { SYNCHRONIZING } from "@/noTrans";

/**
 * 同期中のオーバーレイコンポーネント
 * UIを表示したまま、操作を無効化しローディングを表示します
 */
export function SyncLoadingOverlay() {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-100"
			aria-busy="true"
			role="status"
		>
			<div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 border-2 border-border-strong">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				<p className={`${TYPOGRAPHY.LABEL} font-medium text-text-primary`}>
					{SYNCHRONIZING}
				</p>
			</div>
		</div>
	);
}
