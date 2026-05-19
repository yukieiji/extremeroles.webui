import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useExportCsv } from "@/hooks/useBackend";
import { fetchCsvData } from "@/logics/api";

vi.mock("@/logics/api", () => ({
	fetchCsvData: vi.fn(),
}));

vi.mock("@/hooks/useManualBlock", () => ({
	useBlockAsync: () => (fn: () => Promise<void>) => fn(),
}));

describe("useExportCsv", () => {
	const mockCsvData = {
		CsvBody: "test,csv,data",
		ExportAt: "2023-10-01T12:34:56",
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// biome-ignore lint/suspicious/noExplicitAny: mock
		(fetchCsvData as any).mockResolvedValue(mockCsvData);

		// URL.createObjectURL のモック化
		vi.stubGlobal("URL", {
			createObjectURL: vi.fn(() => "blob:url"),
			revokeObjectURL: vi.fn(),
		});

		// showSaveFilePicker をデフォルトで未定義にする
		// biome-ignore lint/suspicious/noExplicitAny: mock
		delete (window as any).showSaveFilePicker;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("showSaveFilePicker が利用可能な場合、それを使用して保存する", async () => {
		const mockWritable = {
			write: vi.fn().mockResolvedValue(undefined),
			close: vi.fn().mockResolvedValue(undefined),
		};
		const mockHandle = {
			createWritable: vi.fn().mockResolvedValue(mockWritable),
		};
		const showSaveFilePicker = vi.fn().mockResolvedValue(mockHandle);
		vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);

		const { result } = renderHook(() => useExportCsv());
		await result.current();

		expect(showSaveFilePicker).toHaveBeenCalledWith({
			suggestedName: "export_20231001_123456.csv",
			types: [
				{
					description: "CSV File",
					accept: { "text/csv": [".csv"] },
				},
			],
		});
		expect(mockHandle.createWritable).toHaveBeenCalled();
		expect(mockWritable.write).toHaveBeenCalledWith(expect.any(Blob));
		expect(mockWritable.close).toHaveBeenCalled();
	});

	it("showSaveFilePicker で AbortError が発生した場合、静かに終了しフォールバックしない", async () => {
		const abortError = new Error("The user aborted a request.");
		abortError.name = "AbortError";
		const showSaveFilePicker = vi.fn().mockRejectedValue(abortError);
		vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);

		const createElementSpy = vi.spyOn(document, "createElement");

		const { result } = renderHook(() => useExportCsv());
		await result.current();

		expect(showSaveFilePicker).toHaveBeenCalled();
		// 'a' タグが作成されていないことを確認
		const aCalls = createElementSpy.mock.calls.filter(
			(call) => call[0] === "a",
		);
		expect(aCalls.length).toBe(0);
	});

	it("showSaveFilePicker が失敗（AbortError以外）した場合、aタグによるダウンロードにフォールバックする", async () => {
		const otherError = new Error("Some other error");
		const showSaveFilePicker = vi.fn().mockRejectedValue(otherError);
		vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);

		const originalCreateElement = document.createElement.bind(document);
		const mockA = originalCreateElement("a");
		const clickSpy = vi.spyOn(mockA, "click").mockImplementation(() => {});
		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			if (tagName === "a") {
				return mockA;
			}
			return originalCreateElement(tagName);
		});

		const { result } = renderHook(() => useExportCsv());
		// console.error を一時的に抑制
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await result.current();

		expect(fetchCsvData).toHaveBeenCalled();
		expect(document.createElement).toHaveBeenCalledWith("a");
		expect(mockA.download).toBe("export_20231001_123456.csv");
		expect(clickSpy).toHaveBeenCalled();
		errorSpy.mockRestore();
	});

	it("showSaveFilePicker が未定義の場合、aタグによるダウンロードを行う", async () => {
		const originalCreateElement = document.createElement.bind(document);
		const mockA = originalCreateElement("a");
		const clickSpy = vi.spyOn(mockA, "click").mockImplementation(() => {});
		vi.spyOn(document, "createElement").mockImplementation((tagName) => {
			if (tagName === "a") {
				return mockA;
			}
			return originalCreateElement(tagName);
		});

		const { result } = renderHook(() => useExportCsv());
		await result.current();

		expect(document.createElement).toHaveBeenCalledWith("a");
		expect(mockA.download).toBe("export_20231001_123456.csv");
		expect(clickSpy).toHaveBeenCalled();
	});
});
