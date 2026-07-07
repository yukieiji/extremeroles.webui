import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MockPlayerSettingsSection } from "@/feature/Settings/MockPlayerSettingsSection";
import { translationMetaData } from "@/logics/api";

// 翻訳データのモック設定
translationMetaData.playerName = "プレイヤーネーム";

describe("MockPlayerSettingsSection", () => {
	it("renders the input and current mock player names", () => {
		const mockPlayerNames = ["Player1", "Player2"];
		const onUpdate = vi.fn();

		render(
			<MockPlayerSettingsSection
				mockPlayerNames={mockPlayerNames}
				onUpdate={onUpdate}
			/>,
		);

		expect(screen.getByPlaceholderText("プレイヤーネーム")).toBeInTheDocument();
		expect(screen.getByText("Player1")).toBeInTheDocument();
		expect(screen.getByText("Player2")).toBeInTheDocument();
	});

	it("calls onUpdate with a new name when the add button is clicked", () => {
		const mockPlayerNames: string[] = [];
		const onUpdate = vi.fn();

		render(
			<MockPlayerSettingsSection
				mockPlayerNames={mockPlayerNames}
				onUpdate={onUpdate}
			/>,
		);

		const input = screen.getByPlaceholderText("プレイヤーネーム");
		fireEvent.change(input, { target: { value: "NewPlayer" } });

		// Plusアイコンを持つボタンを探す
		const buttons = screen.getAllByRole("button");
		const plusButton = buttons.find((b) => b.querySelector("svg.lucide-plus"));

		if (plusButton) {
			fireEvent.click(plusButton);
		} else {
			throw new Error("Plus button not found");
		}

		expect(onUpdate).toHaveBeenCalledWith(["NewPlayer"]);
	});

	it("calls onUpdate with a new name when Enter is pressed", () => {
		const mockPlayerNames: string[] = [];
		const onUpdate = vi.fn();

		render(
			<MockPlayerSettingsSection
				mockPlayerNames={mockPlayerNames}
				onUpdate={onUpdate}
			/>,
		);

		const input = screen.getByPlaceholderText("プレイヤーネーム");
		fireEvent.change(input, { target: { value: "NewPlayer" } });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onUpdate).toHaveBeenCalledWith(["NewPlayer"]);
	});

	it("does not call onUpdate when trying to add a duplicate name", () => {
		const mockPlayerNames = ["Player1"];
		const onUpdate = vi.fn();

		render(
			<MockPlayerSettingsSection
				mockPlayerNames={mockPlayerNames}
				onUpdate={onUpdate}
			/>,
		);

		const input = screen.getByPlaceholderText("プレイヤーネーム");
		fireEvent.change(input, { target: { value: "Player1" } });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onUpdate).not.toHaveBeenCalled();
	});

	it("calls onUpdate with filtered list when a delete button is clicked", () => {
		const mockPlayerNames = ["Player1", "Player2"];
		const onUpdate = vi.fn();

		render(
			<MockPlayerSettingsSection
				mockPlayerNames={mockPlayerNames}
				onUpdate={onUpdate}
			/>,
		);

		const deleteButton = screen.getByLabelText("Delete Player1");
		fireEvent.click(deleteButton);

		expect(onUpdate).toHaveBeenCalledWith(["Player2"]);
	});
});
