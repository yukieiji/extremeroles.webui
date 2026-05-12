import type { FallbackProps } from "react-error-boundary";
import { resetApiCache } from "../../logics/api.store";
import {
	ERROR_DETAIL_LABEL,
	ERROR_RETRY_BUTTON,
	ERROR_TITLE,
} from "../../noTrans";

/**
 * エラー画面を表示するためのコンポーネント
 * react-error-boundary の fallbackComponent として使用されます
 */
export function ErrorView({ error, resetErrorBoundary }: FallbackProps) {
	const handleRetry = () => {
		// APIのキャッシュをリセットして再試行
		resetApiCache();
		resetErrorBoundary();
	};

	// エラーメッセージの取得
	const errorMessage =
		error instanceof Error ? error.message : String(error || "");

	return (
		<div
			role="alert"
			id="error-screen"
			className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-slate-100 p-6"
		>
			<div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 border border-red-500/50">
				<h2 className="text-2xl font-bold text-red-400 mb-4">{ERROR_TITLE}</h2>
				<div className="mb-6">
					<p className="text-slate-400 text-sm mb-2">{ERROR_DETAIL_LABEL}</p>
					<pre className="bg-slate-950 p-4 rounded text-xs text-red-300 overflow-auto max-h-40 whitespace-pre-wrap">
						{errorMessage}
					</pre>
				</div>
				<button
					type="button"
					onClick={handleRetry}
					className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors duration-200"
				>
					{ERROR_RETRY_BUTTON}
				</button>
			</div>
		</div>
	);
}
