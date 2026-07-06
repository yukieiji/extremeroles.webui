import { create } from "zustand";
import type { AuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import { createAuOptionViewerSlice } from "./slices/auOptionViewerSlice";
import type { ExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import { createExROptionViewerSlice } from "./slices/exrOptionViewerSlice";
import type { GlobalUiSlice } from "./slices/globalUiSlice";
import { createGlobalUiSlice } from "./slices/globalUiSlice";
import type { OptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import { createOptionGroupToggleSidebarSlice } from "./slices/optionGroupToggleSidebarSlice";
import type { RightSidePanelSlice } from "./slices/rightSidePanelSlice";
import { createRightSidePanelSlice } from "./slices/rightSidePanelSlice";
import type { RoleFilterSlice } from "./slices/roleFilterSlice";
import { createRoleFilterSlice } from "./slices/roleFilterSlice";
import type { SearchBarSlice } from "./slices/searchBarSlice";
import { createSearchBarSlice } from "./slices/searchBarSlice";
import type { SimulationSlice } from "./slices/simulationSlice";
import { createSimulationSlice } from "./slices/simulationSlice";

/**
 * Zustand ストアの作成
 */
export const useStore = create<
	GlobalUiSlice &
		SearchBarSlice &
		OptionGroupToggleSidebarSlice &
		RightSidePanelSlice &
		AuOptionViewerSlice &
		ExROptionViewerSlice &
		RoleFilterSlice &
		SimulationSlice
>()((...a) => {
	return {
		...createGlobalUiSlice(...a),
		...createSearchBarSlice(...a),
		...createOptionGroupToggleSidebarSlice(...a),
		...createRightSidePanelSlice(...a),
		...createAuOptionViewerSlice(...a),
		...createExROptionViewerSlice(...a),
		...createRoleFilterSlice(...a),
		...createSimulationSlice(...a),
	};
});
