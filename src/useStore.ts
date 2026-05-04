import { create } from "zustand";
import type { AuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import { createAuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import type { ExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import type { GlobalUiSlice } from "./slices/globalUiSlice";
import { createGlobalUiSlice } from "./slices/globalUiSlice";
import type { OptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import { createOptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import type { RightFloatingPanelSlice } from "./slices/rightFloatingPanelSlice";
import { createRightFloatingPanelSlice } from "./slices/rightFloatingPanelSlice";
import type { RoleFilterSlice } from "./slices/roleFilterSlice";
import { createRoleFilterSlice } from "./slices/roleFilterSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	GlobalUiSlice &
		OptionGroupToggleSidebarSlice &
		RightFloatingPanelSlice &
		AuOptionViewerSlice &
		ExROptionViewerSlice &
		RoleFilterSlice
>()((...a) => {
	return {
		...createGlobalUiSlice(...a),
		...createOptionGroupToggleSidebarSlice(...a),
		...createRightFloatingPanelSlice(...a),
		...createAuOptionViewerSlice(...a),
		...createExROptionViewerSlice(...a),
		...createRoleFilterSlice(...a),
	};
});
