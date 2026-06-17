import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";

interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	onSelect: (roleId: number, event: React.MouseEvent) => void;
}

/**
 * 役職をグリッド形式で表示するリストコンポーネント
 */
export function RoleGrid({ items, onSelect }: RoleGridProps) {
	if (items.length === 0) {
		return (
			<div className="text-center py-8 text-text-secondary italic">
				{"見つかりませんでした"}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
			{items.map(({ roleId, roleName }) => {
				return (
					<FieldLabel
						key={roleId}
						className="cursor-pointer hover:bg-component-hover has-data-checked:border-primary-action has-data-checked:bg-primary-action/15"
					>
						<Field orientation="horizontal">
							<Checkbox onClick={(e) => onSelect(roleId, e)} />
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
