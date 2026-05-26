import { RightPanelItemColumnLayout } from "@/components/parts/RightPanelItemColumnLayout";
import { ExRGeneralTabOptionViewer } from "./ExRGeneralTabOptionViewer";

/**
 * ExRの設定内容を右パネルに表示するコンポーネント
 */
export function ExROptionViewer() {
	return (
		<RightPanelItemColumnLayout>
			<ExRGeneralTabOptionViewer />
		</RightPanelItemColumnLayout>
	);
}
