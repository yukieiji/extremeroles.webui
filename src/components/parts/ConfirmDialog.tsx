interface ConfirmDialogProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * 確認ダイアログコンポーネント
 */
export function ConfirmDialog({
	title,
	message,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[110]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
		>
			<div className="bg-white p-6 rounded-lg shadow-2xl flex flex-col gap-6 border border-gray-200 max-w-sm w-full mx-4">
				<div className="flex flex-col gap-2">
					<h3 id="dialog-title" className="text-xl font-bold text-gray-900">
						{title}
					</h3>
					<p className="text-gray-600">{message}</p>
				</div>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
}
