import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

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
				const isChecked = selectedRoleIds.includes(roleId);
				return (
					<button
						type="button"
						key={roleId}
						className={cn(
							"cursor-pointer transition-colors border border-border-strong rounded-lg p-2.5 shadow-md flex items-center gap-2 w-full",
							isChecked && "bg-info/20 border-info/50",
						)}
						onClick={(e) => {
							onSelect(roleId, e);
						}}
					>
						<Checkbox
							checked={isChecked}
							onCheckedChange={() => {}}
							className="pointer-events-none"
						/>
						<span className="text-sm font-medium text-text-primary select-none">
							{roleName}
						</span>
					</button>
				);
			})}
		</div>
	);
}
