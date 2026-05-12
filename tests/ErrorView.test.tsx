import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import App from "../src/App";
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
			<div>{children}</div>
		),
	};
});

describe("Error Handling", () => {
	it("初期データの取得に失敗した場合にエラー画面を表示する", async () => {
		// コンソールエラーを抑制（意図的なエラーのため）
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(<App />);

		// エラー画面が表示されるのを待機
		const errorTitle = await screen.findByText(ERROR_TITLE);
		expect(errorTitle).toBeInTheDocument();

		consoleSpy.mockRestore();
	});
});
