import { Settings } from "lucide-react";
import { useEffect, useTransition } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from "../components/ui/sidebar";
import { TYPOGRAPHY } from "../designConstants";
import {
	AU_OPTIONS_TITLE,
	AU_SHORT_LABEL,
	EXR_OPTIONS_TITLE,
	EXR_SHORT_LABEL,
	OPTION_SIDEBAR_ARIA,
	ROLE_FILTER_SHORT_LABEL,
	ROLE_FILTER_TITLE,
	SETTINGS_TITLE,
	SIDEBAR_CLOSE_ARIA,
	SIDEBAR_OPEN_ARIA,
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
	const { open } = useSidebar();
	const selectedTab = useStore((state) => {
		return state.selectedTab;
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

	const triggerLabel = open ? SIDEBAR_CLOSE_ARIA : SIDEBAR_OPEN_ARIA;

	return (
		<Sidebar collapsible="icon" aria-label={OPTION_SIDEBAR_ARIA}>
			<SidebarHeader className="flex flex-row items-center justify-end group-data-[collapsible=icon]:justify-center">
				<SidebarTrigger title={triggerLabel} aria-label={triggerLabel} />
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{TABS.map((tab) => {
						return (
							<SidebarMenuItem key={tab.id}>
								<SidebarMenuButton
									isActive={selectedTab === tab.id}
									onClick={() => {
										handleTabChange(tab.id);
									}}
									className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:font-bold"
								>
									<span
										className={`group-data-[collapsible=icon]:hidden ${TYPOGRAPHY.SIDEBAR}`}
									>
										{tab.label}
									</span>
									<span
										className={`hidden group-data-[collapsible=icon]:block ${TYPOGRAPHY.SIDEBAR}`}
									>
										{tab.shortLabel}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							data-testid="sidebar-settings-button"
							onClick={() => {
								openDialog({ type: "settings", title: SETTINGS_TITLE });
							}}
							className="group-data-[collapsible=icon]:justify-center"
						>
							<Settings />
							<span
								className={`group-data-[collapsible=icon]:hidden ${TYPOGRAPHY.SIDEBAR}`}
							>
								{SETTINGS_TITLE}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
