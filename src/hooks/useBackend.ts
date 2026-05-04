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
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");

				// ファイル名の生成: export_YYYYMMDD_HHMMSS.csv
				const dateStr = result.ExportAt.replace(/[:.-]/g, "").replace("T", "_");
				a.href = url;
				a.download = `export_${dateStr}.csv`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error("Failed to export CSV:", error);
				// エラーハンドリングが必要な場合はここに追加
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
