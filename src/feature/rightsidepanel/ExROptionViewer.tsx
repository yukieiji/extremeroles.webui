import { exrOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { ExRGeneralCategoryViewer } from "./ExRGeneralCategoryViewer";
import { ExRRoleViewerSection } from "./ExRRoleViewerSection";

/**
 * ExRの設定内容を表示するコンポーネント
 */
export function ExROptionViewer() {
	const generalTabCategoryIds = exrOptionMetaData.tabs[0]?.categoryIds || [];
	const isExrTabOpen = useStore((state) => state.isExrTabOpen);
	const toggleExrTab = useStore((state) => state.toggleExrTab);

	return (
		<div className="flex flex-col gap-1">
			{generalTabCategoryIds.map((categoryId) => (
				<ExRGeneralCategoryViewer key={categoryId} categoryId={categoryId} />
			))}
			<ExRRoleViewerSection
				tabId={1}
				title="クルー役職"
				isOpen={isExrTabOpen[1] ?? true}
				onToggle={() => toggleExrTab(1)}
			/>
			<ExRRoleViewerSection
				tabId={2}
				title="インポスター役職"
				isOpen={isExrTabOpen[2] ?? true}
				onToggle={() => toggleExrTab(2)}
			/>
			<ExRRoleViewerSection
				tabId={3}
				title="第三陣営"
				isOpen={isExrTabOpen[3] ?? true}
				onToggle={() => toggleExrTab(3)}
			/>
			<ExRRoleViewerSection
				tabId={4}
				title="役職セット"
				isOpen={isExrTabOpen[4] ?? true}
				onToggle={() => toggleExrTab(4)}
			/>
			<ExRRoleViewerSection
				tabId={5}
				title="幽霊クルー"
				isOpen={isExrTabOpen[5] ?? true}
				onToggle={() => toggleExrTab(5)}
			/>
			<ExRRoleViewerSection
				tabId={6}
				title="幽霊インポスター"
				isOpen={isExrTabOpen[6] ?? true}
				onToggle={() => toggleExrTab(6)}
			/>
			<ExRRoleViewerSection
				tabId={7}
				title="幽霊第三陣営"
				isOpen={isExrTabOpen[7] ?? true}
				onToggle={() => toggleExrTab(7)}
			/>
		</div>
	);
}
