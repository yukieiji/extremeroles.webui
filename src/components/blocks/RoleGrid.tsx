import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";

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
					<FieldLabel key={roleId} className="cursor-pointer">
						<Field orientation="horizontal">
							<Checkbox
								checked={isChecked}
								onCheckedChange={() => {}}
								onClick={(e) => onSelect(roleId, e)}
							/>
							<FieldContent>
								<FieldTitle>{roleName}</FieldTitle>
							</FieldContent>
						</Field>
					</FieldLabel>
				);
			})}
		</div>
	);
}
