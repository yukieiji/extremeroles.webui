import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { handlers } from "../mocks/handlers";
import { resetApiCache } from "../src/logics/api";

const server = setupServer(...handlers);

// jsdom does not have a default base URL for relative fetches
if (typeof window !== "undefined") {
	if (!window.location.origin || window.location.origin === "null") {
		Object.defineProperty(window, "location", {
			value: new URL("http://localhost:5173"),
			writable: true,
		});
	}
}

beforeAll(() => {
	server.listen();
});

afterEach(() => {
	server.resetHandlers();
	resetApiCache();
});

afterAll(() => {
	server.close();
});
