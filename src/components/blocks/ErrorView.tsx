import { AlertCircle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { TYPOGRAPHY } from "@/designConstants";
import { resetApiCache } from "../../logics/api.store";
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
						<AlertCircle size={100} className="text-error" />
					</CardTitle>
					<CardDescription>
						<h1 className={`${TYPOGRAPHY.LABEL} text-text-primary`}>
							エラーが発生しました
						</h1>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<p className={`${TYPOGRAPHY.LABEL} text-text-primary`}>詳細</p>
						<div className="rounded-lg border border-border-strong shadow-sm">
							<pre
								className={`${TYPOGRAPHY.SMALL} p-2 overflow-auto whitespace-pre-wrap text-text-secondary`}
							>
								{errorMessage}
							</pre>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						size="lg"
						onClick={handleRetry}
						className={`${TYPOGRAPHY.LABEL} w-full  text-text-primary`}
					>
						<RefreshCw />
						再試行
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
