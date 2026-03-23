import { create } from "zustand";
import type { OptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import { createOptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import type { OptionViewerSlice } from "./slices/optionViewerSlice";
import { createOptionViewerSlice } from "./slices/optionViewerSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	OptionGroupToggleSidebarSlice & OptionViewerSlice
>()((...a) => {
	return {
		...createOptionGroupToggleSidebarSlice(...a),
		...createOptionViewerSlice(...a),
	};
});
