import { SyncLoadingOverlay } from "../components/parts/SyncLoadingOverlay";
import { useStore } from "../useStore";

export function BlockableLoading() {
	const isBlock = useStore((state) => state.isPendingBlock);
	const blockCount = useStore((state) => state.blockCount);

	return isBlock || blockCount > 0 ? <SyncLoadingOverlay /> : null;
}
