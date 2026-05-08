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
import type { SearchSlice } from "./slices/searchSlice";
import { createSearchSlice } from "./slices/searchSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	GlobalUiSlice &
		OptionGroupToggleSidebarSlice &
		RightFloatingPanelSlice &
		AuOptionViewerSlice &
		ExROptionViewerSlice &
		RoleFilterSlice &
		SearchSlice
>()((...a) => {
	return {
		...createGlobalUiSlice(...a),
		...createOptionGroupToggleSidebarSlice(...a),
		...createRightFloatingPanelSlice(...a),
		...createAuOptionViewerSlice(...a),
		...createExROptionViewerSlice(...a),
		...createRoleFilterSlice(...a),
		...createSearchSlice(...a),
	};
});
