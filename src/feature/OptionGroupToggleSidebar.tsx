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
} from "../components/ui/sidebar";
import { TYPOGRAPHY } from "../designConstants";
import { translationMetaData } from "../logics/api";
import {
	AU_SHORT_LABEL,
	EXR_OPTIONS_TITLE,
	EXR_SHORT_LABEL,
	ROLE_FILTER_TITLE,
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

/**
 * サイドバーコンポーネント
 */
export function OptionGroupToggleSidebar() {
	const tabs: TabItem[] = [
		{
			id: "Au",
			label: translationMetaData.AU_OPTIONS_TITLE,
			shortLabel: AU_SHORT_LABEL,
		},
		{ id: "ExR", label: EXR_OPTIONS_TITLE, shortLabel: EXR_SHORT_LABEL },
		{
			id: "RoleFilter",
			label: ROLE_FILTER_TITLE,
			shortLabel: translationMetaData.ROLE_FILTER_SHORT_LABEL,
		},
	];

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

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="flex flex-row items-center justify-end group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
				<SidebarTrigger />
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu className="group-data-[collapsible=icon]:items-center">
					{tabs.map((tab) => {
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

			<SidebarFooter className="group-data-[collapsible=icon]:p-0">
				<SidebarMenu className="group-data-[collapsible=icon]:items-center">
					<SidebarMenuItem>
						<SidebarMenuButton
							data-testid="sidebar-settings-button"
							onClick={() => {
								openDialog({
									type: "settings",
									title: translationMetaData.SETTINGS_TITLE,
								});
							}}
							className="group-data-[collapsible=icon]:justify-center"
						>
							<Settings />
							<span
								className={`group-data-[collapsible=icon]:hidden ${TYPOGRAPHY.SIDEBAR}`}
							>
								{translationMetaData.SETTINGS_TITLE}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
