import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetApiCache } from "../src/logics/api";
import { server } from "./msw-server";

// jsdom does not have a default base URL for relative fetches
if (typeof window !== "undefined") {
	if (!window.location.origin || window.location.origin === "null") {
		Object.defineProperty(window, "location", {
			value: new URL("http://localhost:5173"),
			writable: true,
		});
	}
	// @ts-expect-error - testing
	window.__API_DELAY__ = 0;
}

beforeAll(() => {
	server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
	server.resetHandlers();
	resetApiCache();
});

afterAll(() => {
	server.close();
});
