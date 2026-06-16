import { cn } from "@/lib/utils";
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
						className={cn(
							"relative border border-border-strong rounded-lg shadow-md items-center hover:bg-muted/50",
							isChecked && "bg-info/20 border-info/50 hover:bg-info/30",
						)}
					>
						<Checkbox
							id={id}
							checked={isChecked}
							onCheckedChange={(_, event) => {
								onSelect(roleId, event as unknown as React.MouseEvent);
							}}
							className="ml-2.5"
						/>
						<FieldLabel
							htmlFor={id}
							className="flex-1 p-2.5 pl-1.5 select-none text-sm font-medium text-text-primary cursor-pointer h-full flex items-center after:absolute after:inset-0"
						>
							{roleName}
						</FieldLabel>
					</Field>
				);
			})}
		</div>
	);
}
