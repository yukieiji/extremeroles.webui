import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { useStore } from "@/useStore";

interface MockPlayerSettingsSectionProps {
	mockPlayerNames: string[];
	onUpdate: (mockPlayerNames: string[]) => void;
}

export function MockPlayerSettingsSection({
	mockPlayerNames,
	onUpdate,
}: MockPlayerSettingsSectionProps) {
	const inputValue = useStore((state) => state.mockPlayerInput);
	const setInputValue = useStore((state) => state.setMockPlayerInput);

	const handleAdd = () => {
		const trimmed = inputValue.trim();
		if (!trimmed) {
			return;
		}
		if (mockPlayerNames.includes(trimmed)) {
			setInputValue("");
			return;
		}
		onUpdate([...mockPlayerNames, trimmed]);
		setInputValue("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleAdd();
		}
	};

	const handleDelete = (name: string) => {
		onUpdate(mockPlayerNames.filter((n) => n !== name));
	};

	return (
		<div className="flex flex-col gap-2">
			<Field orientation="horizontal">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={translationMetaData.playerName}
					className={TYPOGRAPHY.SMALL}
				/>
				<Button size="icon" onClick={handleAdd} disabled={!inputValue.trim()}>
					<Plus />
				</Button>
			</Field>
			<div className="flex flex-wrap gap-1 min-h-8">
				{mockPlayerNames.map((name) => (
					<Badge
						key={name}
						className={TYPOGRAPHY.CHILD_LABEL}
						variant="outline"
					>
						{name}
						<Button
							onClick={(e) => {
								e.stopPropagation();
								handleDelete(name);
							}}
							aria-label={`Delete ${name}`}
							variant="ghost"
						>
							<X data-icon="inline-end" />
						</Button>
					</Badge>
				))}
			</div>
		</div>
	);
}
