import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	AU_OPTIONS_TITLE,
	EXR_OPTIONS_TITLE,
	OFF,
	ON,
	ROLE_FILTER_TITLE,
	SETTINGS_DEFAULT_CATEGORY_OPEN,
	SETTINGS_DEFAULT_TAB,
} from "@/noTrans";
import type { SelectedTab } from "@/slices/optionGroupToggleSidebarSlice";
import { useStore } from "@/useStore";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

interface SettingsDialogProps {
	title: string;
}

const TABS: { id: SelectedTab; label: string }[] = [
	{ id: "Au", label: AU_OPTIONS_TITLE },
	{ id: "ExR", label: EXR_OPTIONS_TITLE },
	{ id: "RoleFilter", label: ROLE_FILTER_TITLE },
];

/**
 * 設定ダイアログのコンテンツコンポーネント
 */
export function SettingsDialog({ title }: SettingsDialogProps) {
	const defaultTab = useStore((state) => state.defaultTab);
	const setDefaultTab = useStore((state) => state.setDefaultTab);
	const defaultCategoryOpen = useStore((state) => state.defaultCategoryOpen);
	const setDefaultCategoryOpen = useStore(
		(state) => state.setDefaultCategoryOpen,
	);

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<div className="grid gap-6 py-4">
				<div className="flex flex-col gap-3">
					<Label className="text-base font-semibold">
						{SETTINGS_DEFAULT_TAB}
					</Label>
					<div className="grid grid-cols-1 gap-2">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setDefaultTab(tab.id)}
								className={`
                  flex items-center px-4 py-2 rounded-md border transition-colors text-sm
                  ${
										defaultTab === tab.id
											? "bg-blue-500 text-white border-blue-500"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
									}
                `}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Label className="text-base font-semibold">
						{SETTINGS_DEFAULT_CATEGORY_OPEN}
					</Label>
					<div className="flex items-center gap-3">
						<span className="text-sm text-gray-500">
							{defaultCategoryOpen ? ON : OFF}
						</span>
						<Switch
							checked={defaultCategoryOpen}
							onCheckedChange={setDefaultCategoryOpen}
						/>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}
