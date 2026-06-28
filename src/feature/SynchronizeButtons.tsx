import { useShallow } from "zustand/react/shallow";
import { ExportButton } from "@/components/parts/ExportButton";
import { ImportButton } from "@/components/parts/ImportButton";
import { SyncButton } from "@/components/parts/SyncButton";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	useBackendUpdate,
	useExportCsv,
	useSyncBackend,
} from "@/hooks/useBackend";
import { postExrCsv, translationMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { format } from "@/logics/stringUtils";
import { useStore } from "@/useStore";

export function SynchronizeButtons() {
	const syncer = useSyncBackend();
	const backendUpdater = useBackendUpdate();
	const openDialog = useStore((state) => state.openBlockDialog);
	const presetName = useStore(
		useShallow((state) => {
			const option = state.exrValue[PRESET_OPTION_UNIQUE_ID];
			const selection = option?.selection ?? 0;
			return (
				state.presetNames[selection] ?? String(option?.values[selection] ?? "")
			);
		}),
	);

	const handleImport = (csvBody: string) => {
		openDialog({
			type: "confirm",
			title: translationMetaData.IMPORT_CONFIRM_TITLE,
			message: format(translationMetaData.IMPORT_CONFIRM_MESSAGE, presetName),
			onConfirm: () => {
				backendUpdater(() => postExrCsv(csvBody));
			},
		});
	};
	const exporter = useExportCsv();

	return (
		<div className="px-4 flex flex-row gap-2">
			<ButtonGroup>
				<ImportButton onImport={handleImport} />
				<ExportButton onClick={exporter} />
			</ButtonGroup>
			<SyncButton onClick={syncer} />
		</div>
	);
}
