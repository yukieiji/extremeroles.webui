import { create } from "zustand";
import type { AuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import { createAuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import type { ExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import type { GlobalUiSlice } from "./slices/globalUiSlice";
import { createGlobalUiSlice } from "./slices/globalUiSlice";
import type { OptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import { createOptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	GlobalUiSlice &
		OptionGroupToggleSidebarSlice &
		AuOptionViewerSlice &
		ExROptionViewerSlice
>()((...a) => {
	return {
		...createGlobalUiSlice(...a),
		...createOptionGroupToggleSidebarSlice(...a),
		...createAuOptionViewerSlice(...a),
		...createExROptionViewerSlice(...a),
	};
});
