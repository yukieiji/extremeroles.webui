import { CANCEL } from "../../noTrans";

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
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
			<div className="px-6 py-4 border-b border-gray-100">
				<h3 className="text-xl font-bold text-gray-900">{title}</h3>
			</div>
			<div className="px-6 py-6">
				<p className="text-gray-600 leading-relaxed">{message}</p>
			</div>
			<div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
				>
					{CANCEL}
				</button>
				<button
					type="button"
					onClick={onConfirm}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
				>
					OK
				</button>
			</div>
		</div>
	);
}
