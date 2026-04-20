import { ConfirmDialog } from "../components/parts/ConfirmDialog";
import { useStore } from "../useStore";

export function BlockableDialog() {
	const blockDialog = useStore((state) => state.blockDialog);
	const closeDialog = useStore((state) => state.closeBlockDialog);

	return blockDialog ? (
		<div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<ConfirmDialog
				title={blockDialog.title}
				message={blockDialog.message}
				onConfirm={() => {
					blockDialog.onConfirm()
					closeDialog()
				}}
				onCancel={closeDialog}
			/>
		</div>
	) : null;
}
