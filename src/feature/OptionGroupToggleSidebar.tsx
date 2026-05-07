import { Settings } from "lucide-react";
import { useEffect, useTransition } from "react";
import { OptionGroupToggleSidebarToggleButton } from "../components/parts/OptionGroupToggleSidebarToggleButton";
import { Button } from "../components/ui/button";
import {
	AU_OPTIONS_TITLE,
	AU_SHORT_LABEL,
	EXR_OPTIONS_TITLE,
	EXR_SHORT_LABEL,
	OPTION_SIDEBAR_ARIA,
	ROLE_FILTER_SHORT_LABEL,
	ROLE_FILTER_TITLE,
	SETTINGS_TITLE,
} from "../noTrans";
import type { SelectedTab } from "../slices/optionGroupToggleSidebarSlice";
import { useStore } from "../useStore";

/**
 * タブ情報の定義
 */
interface TabItem {
	id: SelectedTab;
	label: string;
	shortLabel: string;
}

const TABS: TabItem[] = [
	{ id: "Au", label: AU_OPTIONS_TITLE, shortLabel: AU_SHORT_LABEL },
	{ id: "ExR", label: EXR_OPTIONS_TITLE, shortLabel: EXR_SHORT_LABEL },
	{
		id: "RoleFilter",
		label: ROLE_FILTER_TITLE,
		shortLabel: ROLE_FILTER_SHORT_LABEL,
	},
];

/**
 * サイドバーコンポーネント
 */
export function OptionGroupToggleSidebar() {
	const isSidebarOpen = useStore((state) => {
		return state.isSidebarOpen;
	});
	const selectedTab = useStore((state) => {
		return state.selectedTab;
	});
	const toggleSidebar = useStore((state) => {
		return state.toggleSidebar;
	});
	const setSelectedTab = useStore((state) => {
		return state.setSelectedTab;
	});
	const setIsSidebarPending = useStore((state) => {
		return state.setIsSidebarPending;
	});
	const openDialog = useStore((state) => {
		return state.openBlockDialog;
	});
	const [isPending, startTransition] = useTransition();

	const handleTabChange = (tab: SelectedTab) => {
		if (tab === selectedTab) {
			return;
		}
		// トランジション開始前に即座にペンディング状態にする
		setIsSidebarPending(true);
		startTransition(() => {
			setSelectedTab(tab);
		});
	};

	useEffect(() => {
		// トランジションが完了したらペンディング状態を解除する
		if (!isPending) {
			setIsSidebarPending(false);
		}
	}, [isPending, setIsSidebarPending]);

	return (
		<aside
			className={`
        fixed left-0 top-0 h-full bg-gray-100 border-r border-gray-300 transition-all duration-300 z-10 flex flex-col
        ${isSidebarOpen ? "w-64" : "w-12"}
      `}
			aria-label={OPTION_SIDEBAR_ARIA}
		>
			<div className="flex justify-between items-center p-2 border-b border-gray-200">
				<div className={isSidebarOpen ? "" : "flex-1"} />
				<OptionGroupToggleSidebarToggleButton
					onClick={toggleSidebar}
					isOpen={isSidebarOpen}
				/>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isSidebarOpen ? (
					<nav className="p-4 flex flex-col gap-4">
						<ul className="flex flex-col gap-2">
							{TABS.map((tab) => {
								return (
									<li key={tab.id}>
										<button
											type="button"
											onClick={() => {
												handleTabChange(tab.id);
											}}
											className={`
                        w-full text-left p-2 rounded-md transition-colors
                        ${selectedTab === tab.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
                      `}
										>
											{tab.label}
										</button>
									</li>
								);
							})}
						</ul>
					</nav>
				) : (
					<div className="flex flex-col items-center pt-8 gap-4">
						{TABS.map((tab) => {
							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => {
										handleTabChange(tab.id);
									}}
									title={tab.label}
									className={`
                    w-8 h-8 rounded-full transition-colors flex items-center justify-center font-bold
                    ${selectedTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}
                  `}
								>
									{tab.shortLabel}
								</button>
							);
						})}
					</div>
				)}
			</div>

			<div className="p-2 border-t border-gray-200">
				<Button
					variant="ghost"
					data-testid="sidebar-settings-button"
					onClick={() => {
						openDialog({ type: "settings", title: SETTINGS_TITLE });
					}}
					className={`
            w-full flex items-center gap-2 p-2 rounded-md
            ${isSidebarOpen ? "justify-start" : "justify-center"}
          `}
					title={isSidebarOpen ? undefined : SETTINGS_TITLE}
				>
					<Settings className="w-5 h-5" />
					{isSidebarOpen && <span>{SETTINGS_TITLE}</span>}
				</Button>
			</div>
		</aside>
	);
}
