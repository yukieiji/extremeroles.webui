import { exrOptionMetaData } from "../../logics/api";
import { type OptionTab } from "../../type";
import { useStore } from "../../useStore";
import { ExRRoleViewerSection } from "./ExRRoleViewerSection";

/**
 * ExRの設定内容を表示するコンポーネント
 */
export function ExROptionViewer() {
	const openedExRRoleTabIds = useStore((state) => state.openedExRRoleTabIds);
	const toggleExRRoleTab = useStore((state) => state.toggleExRRoleTab);

	// 役職タブ1～7を表示対象とする
	const roleTabIds = [1, 2, 3, 4, 5, 6, 7] as const;

	return (
		<div className="flex flex-col gap-1">
			{roleTabIds.map((tabId) => {
				const tabMeta = exrOptionMetaData.tabs[tabId as OptionTab];
				if (!tabMeta) return null;

				return (
					<ExRRoleViewerSection
						key={tabId}
						tabId={tabId}
						title={tabMeta.name}
						isOpen={openedExRRoleTabIds[tabId] ?? false}
						onToggle={() => toggleExRRoleTab(tabId)}
					/>
				);
			})}
		</div>
	);
}
