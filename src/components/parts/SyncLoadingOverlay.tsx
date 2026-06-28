import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";

/**
 * 同期中のオーバーレイコンポーネント
 * UIを表示したまま、操作を無効化しローディングを表示します
 */
export function SyncLoadingOverlay() {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-component-hover backdrop-blur-[1px] z-100"
			aria-busy="true"
			role="status"
		>
			<div className="bg-n4-components-background rounded-lg shadow-md flex flex-col items-center border border-border-strong p-2 pt-4">
				<div className="w-12 h-12 border-4 border-info border-t-transparent rounded-full animate-spin"></div>
				<p className={`${TYPOGRAPHY.LABEL} font-medium text-text-primary p-2`}>
					{translationMetaData.SYNCHRONIZING}
				</p>
			</div>
		</div>
	);
}
