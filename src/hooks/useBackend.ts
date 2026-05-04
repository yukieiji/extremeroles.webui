import { useEffect, useTransition } from "react";
import { fetchCsvData } from "../logics/api";
import { refechAll, resetApiCache } from "../logics/api.store";
import { useStore } from "../useStore";
import { useBlock, useBlockAsync } from "./useManualBlock";

export function useSyncBackend(): () => void {
	const [isPending, startTransition] = useTransition();

	const setUiBlock = useStore((state) => state.setPendingBlock);
	const validate = useStore((state) => state.validateOpenedIds);
	const blockFuncton = useBlock();

	useEffect(() => {
		setUiBlock(isPending);
	}, [isPending, setUiBlock]);

	// 意味論的には二重管理になってるけど予防的にブロックを入れておく
	return () => {
		blockFuncton(() => {
			resetApiCache();
			startTransition(async () => {
				await refechAll();
				validate();
			});
		});
	};
}

export function useExportCsv(): () => Promise<void> {
	const blocker = useBlockAsync();

	return async () => {
		await blocker(async () => {
			try {
				const result = await fetchCsvData();
				const blob = new Blob([result.CsvBody], { type: "text/csv" });
				const dateStr = result.ExportAt.replace(/[:.-]/g, "").replace("T", "_");
				const fileName = `export_${dateStr}.csv`;

				// showSaveFilePickerが利用可能な場合
				if ("showSaveFilePicker" in window) {
					try {
						// biome-ignore lint/suspicious/noExplicitAny: showSaveFilePicker is not in standard lib yet
						const handle = await (window as any).showSaveFilePicker({
							suggestedName: fileName,
							types: [
								{
									description: "CSV File",
									accept: { "text/csv": [".csv"] },
								},
							],
						});
						const writable = await handle.createWritable();
						await writable.write(blob);
						await writable.close();
						return;
					} catch (error: unknown) {
						// ユーザーがキャンセルした場合は静かに終了
						if (error instanceof Error && error.name === "AbortError") {
							return;
						}
						// それ以外のエラーの場合はフォールバックへ進む
						console.error("showSaveFilePicker failed:", error);
					}
				}

				// フォールバック: 従来のaタグによるダウンロード
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Failed to export CSV:", error);
			}
		});
	};
}

export function useBackendUpdate(): (
	update: () => Promise<void>,
) => Promise<void> {
	const sync = useSyncBackend();
	const blocker = useBlockAsync();

	return async (update) => {
		await blocker(async () => {
			await update();
			sync();
		});
	};
}
