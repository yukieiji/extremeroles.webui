import { AlertCircle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { resetApiCache } from "../../logics/api.store";
import {
	ERROR_DETAIL_LABEL,
	ERROR_RETRY_BUTTON,
	ERROR_TITLE,
} from "../../noTrans";
import { Button } from "../ui/button";

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
			className="flex flex-col items-center justify-center h-screen w-full bg-slate-950 text-slate-100 p-6"
		>
			<div className="max-w-md w-full bg-slate-900 rounded-xl shadow-2xl p-8 border border-red-900/50 flex flex-col gap-6">
				<div className="flex flex-col items-center text-center gap-4">
					<div className="p-3 bg-red-500/10 rounded-full">
						<AlertCircle className="w-12 h-12 text-red-500" />
					</div>
					<h2 className="text-2xl font-bold text-red-500">{ERROR_TITLE}</h2>
				</div>

				<div className="space-y-2">
					<p className="text-slate-400 text-sm font-medium">
						{ERROR_DETAIL_LABEL}
					</p>
					<div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
						<pre className="text-xs text-red-400 overflow-auto max-h-40 whitespace-pre-wrap font-mono">
							{errorMessage}
						</pre>
					</div>
				</div>

				<Button
					size="lg"
					onClick={handleRetry}
					className="w-full font-bold gap-2"
					variant="destructive"
				>
					<RefreshCw className="w-4 h-4" />
					{ERROR_RETRY_BUTTON}
				</Button>
			</div>
		</div>
	);
}
