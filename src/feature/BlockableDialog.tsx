import { ConfirmDialog } from "../components/parts/ConfirmDialog";
import { Dialog } from "../components/ui/dialog";
import { useStore } from "../useStore";
import { RoleSelectDialog } from "./rolefilter/RoleSelectDialog";

export function BlockableDialog() {
	const blockDialog = useStore((state) => state.blockDialog);
	const closeDialog = useStore((state) => state.closeBlockDialog);

	return (
		<Dialog
			open={!!blockDialog}
			onOpenChange={(open) => !open && closeDialog()}
		>
			{blockDialog?.type === "confirm" && (
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
			{blockDialog?.type === "roleSelect" && (
				<RoleSelectDialog
					excludeRoleIds={blockDialog.excludeRoleIds}
					onSelect={async (roleIds) => {
						await blockDialog.onSelect(roleIds);
						closeDialog();
					}}
					onCancel={closeDialog}
				/>
			)}
		</Dialog>
	);
}
