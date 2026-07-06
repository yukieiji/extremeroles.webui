import { ClipboardCopy, Play } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { RightPanelGroupColumnLayout } from "@/components/parts/RightPanelGroupColumnLayout";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/designConstants";
import {
	auOptionMetaData,
	exrOptionMetaData,
	translationMetaData,
} from "@/logics/api";
import { generateClipboardText } from "@/logics/clipboardLogic";
import { AU_OPTIONS_TITLE, EXR_OPTIONS_TITLE } from "@/noTrans";
import { useStore } from "@/useStore";
import { AuOptionViewer } from "./AuOptionViewer";
import { ExROptionViewer } from "./ExROptionViewer";
import { RightSidePanelSummary } from "./summary/RightSidePanelSummary";

interface RightSidePanelBodyProps {
	children: ReactNode;
}

export function RightSidePanelBody({ children }: RightSidePanelBodyProps) {
	const handleCopy = () => {
		const state = useStore.getState();
		const text = generateClipboardText(
			state,
			exrOptionMetaData,
			auOptionMetaData,
		);
		console.log(
			JSON.stringify({
				type: "user_action",
				action: "copyToClipboard",
				payload: { length: text.length },
			}),
		);
		navigator.clipboard.writeText(text).then(() => {
			toast.success(translationMetaData.CLIPBOARD_COPY_SUCCESS);
		});
	};

	const openSimulate = useStore((state) => state.openBlockDialog);

	const handleSimulate = () => {
		openSimulate({
			type: "simulate",
			title: translationMetaData.SIMULATE_LABEL,
		});
	};

	const isAuSettingsOpen = useStore((state) => state.isAuSettingsOpen);
	const toggleAuSettings = useStore((state) => state.toggleAuSettings);
	const isExrSettingsOpen = useStore((state) => state.isExrSettingsOpen);
	const toggleExrSettings = useStore((state) => state.toggleExrSettings);

	return (
		<div className="p-2 h-full flex-1 min-w-0 bg-n4-components-background border-l border-border-strong shadow-2xl relative">
			{children}
			<div className="flex flex-col h-full">
				<div className="p-2 flex flex-col border-b border-border-strong">
					<div className="p-2 flex items-center justify-between">
						<h2 className={TYPOGRAPHY.SIDEBAR}>
							{translationMetaData.RIGHT_PANEL_TITLE}
						</h2>
					</div>
					<Button
						variant="default"
						size="sm"
						className="w-full flex items-center"
						onClick={handleCopy}
					>
						<ClipboardCopy className="w-4 h-4" />
						{translationMetaData.CLIPBOARD_COPY_BUTTON}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="w-full flex items-center mt-2"
						onClick={handleSimulate}
					>
						<Play className="w-4 h-4" />
						{translationMetaData.SIMULATE_LABEL}
					</Button>
				</div>
				<div className="py-2 flex-1 overflow-y-scroll">
					<RightSidePanelSummary />
					<div className="py-4">
						<RightPanelGroupColumnLayout>
							<ViewerGroupAccordion
								title={AU_OPTIONS_TITLE}
								isOpen={isAuSettingsOpen}
								onToggle={toggleAuSettings}
							>
								<AuOptionViewer />
							</ViewerGroupAccordion>
							<ViewerGroupAccordion
								title={EXR_OPTIONS_TITLE}
								isOpen={isExrSettingsOpen}
								onToggle={toggleExrSettings}
							>
								<ExROptionViewer />
							</ViewerGroupAccordion>
						</RightPanelGroupColumnLayout>
					</div>
				</div>
			</div>
		</div>
	);
}
