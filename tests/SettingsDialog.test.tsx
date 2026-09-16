import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import { SettingsDialog } from "@/feature/Settings/SettingsDialog";
import { translationMetaData } from "@/logics/api";

describe("SettingsDialog", () => {
	it("renders setting section titles from translationMetaData", () => {
		translationMetaData.THEME_SETTING_TITLE = "テーマ設定";
		translationMetaData.INACTIVE_OPTION_DISPLAY_TITLE =
			"非アクティブのオプション表示";
		translationMetaData.LEFT_SIDEBAR_SETTING = "左サイドバー設定";
		translationMetaData.RIGHT_SIDEBAR_SETTING = "右サイドバー設定";
		translationMetaData.SIMULATE_SETTING_PLAYER_NAME = "ダミープレイヤー名";

		render(
			<Dialog open={true}>
				<SettingsDialog title="設定" />
			</Dialog>,
		);

		expect(screen.getByText("テーマ設定")).toBeInTheDocument();
		expect(
			screen.getByText("非アクティブのオプション表示"),
		).toBeInTheDocument();
		expect(screen.getByText("左サイドバー設定")).toBeInTheDocument();
		expect(screen.getByText("右サイドバー設定")).toBeInTheDocument();
		expect(screen.getByText("ダミープレイヤー名")).toBeInTheDocument();
	});
});
