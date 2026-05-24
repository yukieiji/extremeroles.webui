import type { ReactNode } from "react";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { RightPanelGroupColumnLayout } from "@/components/parts/RightPanelGroupColumnLayout";
import {
	AU_SETTINGS_TITLE,
	EXR_SETTINGS_TITLE,
	RIGHT_PANEL_TITLE,
	SETTING_VALUES_TITLE,
} from "@/noTrans";
import { useStore } from "@/useStore";
import { AuOptionViewer } from "./AuOptionViewer";
import { ExROptionViewer } from "./ExROptionViewer";
import { RightSidePanelSummary } from "./RightSidePanelSummary";

interface RightSidePanelBodyProps {
	children: ReactNode;
}

export function RightSidePanelBody({ children }: RightSidePanelBodyProps) {
	const isSettingsOpen = useStore((state) => state.isSettingsOpen);
	const toggleSettings = useStore((state) => state.toggleSettings);
	const isAuSettingsOpen = useStore((state) => state.isAuSettingsOpen);
	const toggleAuSettings = useStore((state) => state.toggleAuSettings);
	const isExrSettingsOpen = useStore((state) => state.isExrSettingsOpen);
	const toggleExrSettings = useStore((state) => state.toggleExrSettings);

	return (
		<div className="h-full flex-1 min-w-0 bg-white border-l border-gray-200 shadow-2xl relative">
			{children}
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between p-4 border-b border-gray-100">
					<h2 className="text-lg font-semibold">{RIGHT_PANEL_TITLE}</h2>
				</div>
				<div className="flex-1 overflow-y-scroll">
					<RightSidePanelSummary />
					<div className="p-3">
						<ViewerGroupAccordion
							title={SETTING_VALUES_TITLE}
							isOpen={isSettingsOpen}
							onToggle={toggleSettings}
						>
							<RightPanelGroupColumnLayout>
								<ViewerGroupAccordion
									title={AU_SETTINGS_TITLE}
									isOpen={isAuSettingsOpen}
									onToggle={toggleAuSettings}
								>
									<AuOptionViewer />
								</ViewerGroupAccordion>
								<ViewerGroupAccordion
									title={EXR_SETTINGS_TITLE}
									isOpen={isExrSettingsOpen}
									onToggle={toggleExrSettings}
								>
									<ExROptionViewer />
								</ViewerGroupAccordion>
							</RightPanelGroupColumnLayout>
						</ViewerGroupAccordion>
					</div>
				</div>
			</div>
		</div>
	);
}
