import { create } from "zustand";
import type { ExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import { exrOptionViewerSlice as createExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import type { OptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import { createOptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	OptionGroupToggleSidebarSlice & ExROptionViewerSlice
>()((...a) => {
	return {
		...createOptionGroupToggleSidebarSlice(...a),
		...createExROptionViewerSlice(...a),
	};
});
