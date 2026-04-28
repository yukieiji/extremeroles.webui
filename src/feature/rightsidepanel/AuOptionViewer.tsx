import { CREW_ROLES_TITLE, IMPOSTOR_ROLES_TITLE } from "../../noTrans";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuRoleViewerSection } from "./AuRoleViewerSection";
import { AuTab0GeneralCategory } from "./AuTab0GeneralCategory";
import { AuTab0MapCategory } from "./AuTab0MapCategory";

/**
 * Auの設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuOptionViewer() {
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];
	const isAuCrewmateRolesOpen = useStore(
		(state) => state.isAuCrewmateRolesOpen,
	);
	const toggleAuCrewmateRoles = useStore(
		(state) => state.toggleAuCrewmateRoles,
	);
	const isAuImpostorRolesOpen = useStore(
		(state) => state.isAuImpostorRolesOpen,
	);
	const toggleAuImpostorRoles = useStore(
		(state) => state.toggleAuImpostorRoles,
	);

	return (
		<div className="flex flex-col gap-1">
			{tab0CategoryIds.map((categoryId, index) => {
				const isMapCategory = index === 0;
				if (isMapCategory) {
					return <AuTab0MapCategory key={categoryId} categoryId={categoryId} />;
				}
				return (
					<AuTab0GeneralCategory key={categoryId} categoryId={categoryId} />
				);
			})}
			<AuRoleViewerSection
				tabId={1}
				title={CREW_ROLES_TITLE}
				isOpen={isAuCrewmateRolesOpen}
				onToggle={toggleAuCrewmateRoles}
			/>
			<AuRoleViewerSection
				tabId={2}
				title={IMPOSTOR_ROLES_TITLE}
				isOpen={isAuImpostorRolesOpen}
				onToggle={toggleAuImpostorRoles}
			/>
		</div>
	);
}
