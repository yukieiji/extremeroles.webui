import { AlertCircle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { resetApiCache } from "../../logics/api.store";
import {
	ERROR_DETAIL_LABEL,
	ERROR_RETRY_BUTTON,
	ERROR_TITLE,
} from "../../noTrans";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

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
			className="flex flex-col items-center justify-center h-screen w-full"
		>
			<Card>
				<CardHeader className="flex flex-col items-center justify-center">
					<CardTitle>
						<AlertCircle size={100} />
					</CardTitle>
					<CardDescription>
						<h2>{ERROR_TITLE}</h2>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<p>{ERROR_DETAIL_LABEL}</p>
						<div className="rounded-lg border ">
							<pre className="overflow-auto whitespace-pre-wrap">
								{errorMessage}
							</pre>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button size="lg" onClick={handleRetry} className="w-full gap-2">
						<RefreshCw />
						{ERROR_RETRY_BUTTON}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
