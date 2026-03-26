import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { handlers } from "../mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => {
	return server.listen();
});
afterEach(() => {
	return server.resetHandlers();
});
afterAll(() => {
	return server.close();
});

// vitest の node環境で fetch が相対パスを扱えるようにする (MSW用)
// Node.js 18+ では fetch が標準でグローバルに存在しますが、
// 相対パスの解決に問題がある場合は baseURL を設定するか MSW の設定で調整します。

// テスト環境のベースURLを設定 (JSDOM用)
if (typeof window !== "undefined") {
	if (window.location.href === "about:blank") {
		window.history.replaceState(null, "", "http://localhost:5173/");
	}
}
