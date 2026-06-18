import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";

interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	selectedRoleIds: number[];
	onSelect: (roleId: number, isShift: boolean) => void;
}

/**
 * 役職をグリッド形式で表示するリストコンポーネント
 */
export function RoleGrid({ items, selectedRoleIds, onSelect }: RoleGridProps) {
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
				const isChecked = selectedRoleIds.includes(roleId);
				return (
					<FieldLabel
						key={roleId}
						className="cursor-pointer hover:bg-component-hover has-data-checked:border-primary-action/30 has-data-checked:bg-primary-action/5"
						onClick={(event) => {
							// If the user clicked the label (and not the checkbox directly),
							// the checkbox's onCheckedChange will be triggered by a synthetic click.
							// But the synthetic click event often loses the shiftKey state.
							// We can handle the click here to capture the shiftKey.
							// However, we must be careful because clicking the label also triggers onCheckedChange.
							if (event.shiftKey) {
								event.preventDefault(); // Stop default checkbox toggle
								onSelect(roleId, true);
							}
						}}
					>
						<Field orientation="horizontal">
							<Checkbox
								checked={isChecked}
								onCheckedChange={(_, eventDetails) => {
									const event = eventDetails.event as any;
									onSelect(roleId, !!event.shiftKey);
								}}
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
