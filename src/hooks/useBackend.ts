import { useEffect, useTransition } from "react";
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
