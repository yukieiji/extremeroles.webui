import { exrOptionMetaData } from "../../logics/api";
import { OptionTab, type TabId } from "../../type";
import { useStore } from "../../useStore";
import { ExRRoleViewerSection } from "./ExRRoleViewerSection";

/**
 * ExRの設定内容を表示するコンポーネント
 */
export function ExROptionViewer() {
	const openedExRTabIds = useStore((state) => state.openedExRTabIds);
	const toggleExRTab = useStore((state) => state.toggleExRTab);

	// 役職タブ1～7を表示対象とする
	const roleTabIds: TabId[] = [
		OptionTab.CrewmateTab,
		OptionTab.ImpostorTab,
		OptionTab.NeutralTab,
		OptionTab.CombinationTab,
		OptionTab.GhostCrewmateTab,
		OptionTab.GhostImpostorTab,
		OptionTab.GhostNeutralTab,
	];

	return (
		<div className="flex flex-col gap-1">
			{roleTabIds.map((tabId) => {
				const tabMeta = exrOptionMetaData.tabs[tabId];
				if (!tabMeta) {
					return null;
				}

				return (
					<ExRRoleViewerSection
						key={tabId}
						tabId={tabId}
						title={tabMeta.name}
						isOpen={openedExRTabIds[tabId] ?? false}
						onToggle={() => toggleExRTab(tabId)}
					/>
				);
			})}
		</div>
	);
}
