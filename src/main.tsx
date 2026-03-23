import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { resetApiCache } from "./logics/api";

if (import.meta.env.DEV) {
	// @ts-expect-error - テスト用
	window.resetApp = resetApiCache;
}

/**
 * 開発環境の場合にMSWを有効化
 */
async function enableMocking() {
	if (!import.meta.env.DEV) {
		return;
	}

	const { worker } = await import("../mocks/browser");

	// MSWをサービスワーカーとして登録
	return worker.start();
}

enableMocking().then(() => {
	const rootElement = document.getElementById("root");
	if (rootElement) {
		createRoot(rootElement).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	}
});
