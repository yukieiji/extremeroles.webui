import { ConfirmDialog } from "../components/parts/ConfirmDialog";
import { RoleSelectDialog } from "../components/parts/RoleSelectDialog";
import { useStore } from "../useStore";

export function BlockableDialog() {
	const blockDialog = useStore((state) => state.blockDialog);
	const closeDialog = useStore((state) => state.closeBlockDialog);

	if (!blockDialog) return null;

	const contentType = blockDialog.contentType ?? "confirm";

	return (
		<div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			{contentType === "confirm" && (
				<ConfirmDialog
					title={blockDialog.title}
					message={blockDialog.message ?? ""}
					onConfirm={() => {
						blockDialog.onConfirm?.();
						closeDialog();
					}}
					onCancel={closeDialog}
				/>
			)}
			{contentType === "roleSelect" && (
				<RoleSelectDialog
					excludeRoleIds={blockDialog.contentProps?.excludeRoleIds}
					onSelect={(roleId) => {
						blockDialog.onConfirm?.(); // Note: if we need to pass roleId, we might need a different callback pattern
						blockDialog.contentProps?.onSelect(roleId);
						closeDialog();
					}}
					onCancel={closeDialog}
				/>
			)}
		</div>
	);
}
