import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
			<div className="flex gap-2">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={translationMetaData.playerName as string}
					className="flex-1"
				/>
				<Button size="icon" onClick={handleAdd} disabled={!inputValue.trim()}>
					<Plus className="w-4 h-4" />
				</Button>
			</div>
			<div className="flex flex-wrap gap-1 min-h-8">
				{mockPlayerNames.map((name) => (
					<Badge
						key={name}
						variant="secondary"
						className="flex items-center gap-1 pr-1"
					>
						{name}
						<button
							type="button"
							onClick={() => handleDelete(name)}
							className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
							aria-label={`Delete ${name}`}
						>
							<X className="w-3 h-3" />
						</button>
					</Badge>
				))}
			</div>
		</div>
	);
}
