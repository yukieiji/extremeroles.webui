import "@testing-library/jest-dom";

// fetch が相対URLを扱えるように window.location を設定
if (typeof window !== "undefined") {
	Object.defineProperty(window, "location", {
		value: new URL("http://localhost:5173"),
		writable: true,
	});
}
