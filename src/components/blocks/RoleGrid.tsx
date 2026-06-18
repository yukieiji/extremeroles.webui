import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "../ui/field";

interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	onSelect: (roleId: number, isShift: boolean) => void;
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
						className="cursor-pointer hover:bg-component-hover has-data-checked:border-primary-action/30 has-data-checked:bg-primary-action/5"
					>
						<Field orientation="horizontal">
							<Checkbox
								onCheckedChange={(_, eventDetails) => {
									const isShift =
										"shiftKey" in eventDetails.event
											? (eventDetails.event as MouseEvent | KeyboardEvent)
													.shiftKey
											: false;
									onSelect(roleId, isShift);
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
