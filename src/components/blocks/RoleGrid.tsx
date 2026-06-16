import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";

interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	onSelect: (roleId: number, event: React.MouseEvent) => void;
	selectedRoleIds?: number[];
	excludeRoleIds?: number[];
	emptyMessage?: string;
}

/**
 * 役職をグリッド形式で表示するリストコンポーネント
 */
export function RoleGrid({
	items,
	onSelect,
	selectedRoleIds = [],
	emptyMessage = "見つかりませんでした",
}: RoleGridProps) {
	if (items.length === 0) {
		return (
			<div className="text-center py-8 text-text-secondary italic">
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
			{items.map(({ roleId, roleName }) => {
				const id = `role-${roleId}`;
				const isChecked = selectedRoleIds.includes(roleId);
				return (
					<Field
						key={roleId}
						orientation="horizontal"
						className="relative transition-colors border border-border-strong rounded-lg shadow-md items-center hover:bg-component-hover"
					>
						<Checkbox
							id={id}
							checked={isChecked}
							onCheckedChange={() => {}}
							className="ml-2.5 pointer-events-none data-checked:border-info data-checked:bg-info data-checked:text-n4-components-background"
						/>
						<FieldLabel
							htmlFor={id}
							className="flex-1 p-2.5 pl-1.5 select-none text-sm font-medium text-text-primary cursor-pointer h-full flex items-center after:absolute after:inset-0"
							onClick={(e) => {
								onSelect(roleId, e);
								e.preventDefault();
							}}
						>
							{roleName}
						</FieldLabel>
					</Field>
				);
			})}
		</div>
	);
}
