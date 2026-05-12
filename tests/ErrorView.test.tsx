import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import App from "../src/App";
import { resetApiCache } from "../src/logics/api.store";
import { ERROR_TITLE } from "../src/noTrans";

// mswサーバーのセットアップ
const server = setupServer(
	http.get("/au/translation/batch/optionunit/", () => {
		return new HttpResponse(null, { status: 500 });
	}),
	http.post("/au/translation/batch/", () => {
		return new HttpResponse(null, { status: 500 });
	}),
);

beforeAll(() => {
	server.listen();
});
beforeEach(() => {
	resetApiCache();
});
afterEach(() => {
	server.resetHandlers();
});
afterAll(() => {
	server.close();
});

// Sidebarのモック
vi.mock("../src/components/ui/sidebar", async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return {
		...actual,
		useSidebar: () => {
			return { open: true, setOpen: vi.fn() };
		},
		SidebarProvider: ({ children }: { children: React.ReactNode }) => (
			<div data-testid="sidebar-provider">{children}</div>
		),
	};
});

describe("Error Handling", () => {
	it("初期データの取得に失敗した場合にエラー画面を表示する", async () => {
		// コンソールエラーを抑制（意図的なエラーのため）
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		// getAllOptionsが失敗するのを確実にするためにモック
		const apiStore = await import("../src/logics/api.store");
		const getAllOptionsSpy = vi.spyOn(apiStore, "getAllOptions");
		getAllOptionsSpy.mockImplementation(() => {
			throw new Error("Manual Fetch Error");
		});

		render(<App />);

		// エラー画面が表示されるのを待機
		await waitFor(
			() => {
				const errorTitle = screen.queryByText(ERROR_TITLE);
				if (errorTitle) {
					expect(errorTitle).toBeInTheDocument();
					return;
				}
				throw new Error("Still waiting for ErrorBoundary to catch error");
			},
			{ timeout: 10000 },
		);

		consoleSpy.mockRestore();
		getAllOptionsSpy.mockRestore();
	});
});
