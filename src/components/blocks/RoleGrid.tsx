import { translationMetaData } from "@/logics/api";
import { NOT_FOUND } from "@/noTrans";
import { ColoredText } from "../parts/ColoredText";
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
			<div className="text-center text-text-secondary italic">{NOT_FOUND}</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-2">
			{items.map(({ roleId, roleName }) => {
				const isSelected = selectedRoleIds.includes(roleId);
				const transLatedName = translationMetaData[roleName] ?? roleName;
				return (
					<FieldLabel
						key={roleId}
						className="cursor-pointer hover:bg-component-hover has-data-checked:border-primary-action has-data-checked:bg-primary-action/15"
						onClick={(event) => {
							if (event.shiftKey) {
								event.preventDefault();
								onSelect(roleId, true);
							}
						}}
					>
						<Field orientation="horizontal">
							<Checkbox
								key={`${roleId}-${isSelected}`}
								defaultChecked={isSelected}
								onCheckedChange={(_, eventDetails) => {
									const isShift =
										"shiftKey" in eventDetails.event &&
										(eventDetails.event as MouseEvent | KeyboardEvent).shiftKey;
									onSelect(roleId, !!isShift);
								}}
							/>
							<FieldContent>
								<FieldTitle>
									{" "}
									<ColoredText text={transLatedName} />{" "}
								</FieldTitle>
							</FieldContent>
						</Field>
					</FieldLabel>
				);
			})}
		</div>
	);
}
