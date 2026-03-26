import "@testing-library/jest-dom";

// vitest の node 環境で fetch が相対パスを扱えるようにする (MSW用)
if (typeof window === "undefined") {
	const { fetch, Request, Response, Headers } = require("undici");
	// @ts-ignore
	global.fetch = fetch;
	// @ts-ignore
	global.Request = Request;
	// @ts-ignore
	global.Response = Response;
	// @ts-ignore
	global.Headers = Headers;
}

// テスト環境のベースURLを設定 (JSDOM用)
if (typeof window !== "undefined") {
	if (window.location.href === "about:blank") {
		window.history.replaceState(null, "", "http://localhost:5173/");
	}
}
