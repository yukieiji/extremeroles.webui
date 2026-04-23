import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import faviconRaw from "./assets/favicon.svg?raw";
import { resetApiCache } from "./logics/api.store.ts";

/**
 * faviconを埋め込む
 */
const embedFavicon = () => {
	const link =
		(document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
		document.createElement("link");
	link.type = "image/svg+xml";
	link.rel = "icon";
	link.href = `data:image/svg+xml;utf8,${encodeURIComponent(faviconRaw)}`;
	document.head.appendChild(link);
};

embedFavicon();

if (import.meta.env.DEV) {
	// @ts-expect-error - テスト用
	window.resetApp = resetApiCache;
}

/**
 * 開発環境の場合にMSWを有効化
 */
async function enableMocking() {
	// 本番環境（!DEV）ではモックを有効化しない
	// ただし、E2Eテスト環境（process.env.NODE_ENV === 'test'）などの例外を考慮し、
	// 常に import.meta.env.DEV をチェックする
	if (!import.meta.env.DEV) {
		return;
	}

	// VITE_USE_MOCK 環境変数が "true" の場合にのみ有効化
	// これにより、デフォルト（pnpm dev）ではモックが無効になる
	if (import.meta.env.VITE_USE_MOCK !== "true") {
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
