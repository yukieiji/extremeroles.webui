import { ConfirmDialog } from "../components/parts/ConfirmDialog";
import { useStore } from "../useStore";
import { RoleSelectDialog } from "./rolefilter/RoleSelectDialog";

export function BlockableDialog() {
	const blockDialog = useStore((state) => state.blockDialog);
	const closeDialog = useStore((state) => state.closeBlockDialog);

	if (!blockDialog) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			{blockDialog.type === "confirm" && (
				<ConfirmDialog
					title={blockDialog.title}
					message={blockDialog.message}
					onConfirm={() => {
						blockDialog.onConfirm();
						closeDialog();
					}}
					onCancel={closeDialog}
				/>
			)}
			{blockDialog.type === "roleSelect" && (
				<RoleSelectDialog
					excludeRoleIds={blockDialog.excludeRoleIds}
					onSelect={async (roleIds) => {
						await blockDialog.onSelect(roleIds);
						closeDialog();
					}}
					onCancel={closeDialog}
				/>
			)}
		</div>
	);
}
