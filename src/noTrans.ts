/**
 * 翻訳されていない日本語テキストの定数定義
 */

export const SYNC_BUTTON_TITLE = "同期";
export const SYNC_BUTTON_ARIA = "データを同期";
export const CANCEL = "キャンセル";
export const SIDEBAR_CLOSE_ARIA = "サイドバーを閉じる";
export const SIDEBAR_OPEN_ARIA = "サイドバーを開く";
export const VIEWER_ROW_TITLE = "ダブルクリックで設定場所へ移動";
export const ROLE_SPAWN_RATE = "レート";
export const ROLE_SPAWN_COUNT = "数";
export const CLOSE = "閉じる";
export const OPEN = "開く";
export const PRESET_SWITCH_TITLE = "プリセットの切り替え";
export const PRESET_SWITCH_MESSAGE =
	"プリセットを「{0}」から「{1}」に切り替えます";
export const PRESET_INPUT_PLACEHOLDER = "プリセット名を入力...";
export const PRESET_SELECT_ARIA = "プリセットを選択";
export const PANEL_CLOSE_ARIA = "パネルを閉じる";
export const PANEL_OPEN_ARIA = "パネルを開く";
export const RIGHT_PANEL_ARIA = "右フローティングパネル";
export const SETTING_VALUES_TITLE = "設定値";
export const AU_SETTINGS_TITLE = "AmongUsの設定";
export const EXR_SETTINGS_TITLE = "ExRの設定";
export const EXR_CONTENT_TEMP = "ExRの設定コンテンツ";
export const CREW_ROLES_TITLE = "クルー役職";
export const IMPOSTOR_ROLES_TITLE = "インポスター役職";
export const OPTION_SIDEBAR_ARIA = "オプションサイドバー";
export const AU_OPTION_ROW_ARIA = "{0}の設定";
export const AU_ROLE_ROW_ARIA = "{0}の役職";

export const SYNCHRONIZING = "Synchronizing...";
export const RIGHT_PANEL_TITLE = "Right Panel";
export const AU_OPTIONS_TITLE = "Au Options";
export const EXR_OPTIONS_TITLE = "ExR Options";
export const AU_SHORT_LABEL = "A";
export const EXR_SHORT_LABEL = "E";
export const ON = "ON";
export const OFF = "OFF";

/**
 * プレースホルダーを含む文字列を置換します。
 * @param template テンプレート文字列（例: "こんにちは {0} さん"）
 * @param args 置換する値
 * @returns 置換後の文字列
 */
export function format(template: string, ...args: (string | number)[]): string {
	return template.replace(/{(\d+)}/g, (match, index) => {
		const arg = args[Number(index)];
		return arg !== undefined ? String(arg) : match;
	});
}
