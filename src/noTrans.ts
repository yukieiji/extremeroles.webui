/**
 * 翻訳されていない日本語テキストの定数定義
 */

export const EXR_OPTIONS_TITLE = "Extreme Roles";
export const ROLE_FILTER_TITLE = "Role Filter";
export const AU_SHORT_LABEL = "A";
export const EXR_SHORT_LABEL = "E";

export const SYNC_BUTTON_TITLE = "同期";
export const IMPORT_BUTTON_TITLE = "CSVインポート";
export const IMPORT_CONFIRM_TITLE = "インポートの確認";
export const IMPORT_CONFIRM_MESSAGE =
	"CSVファイルをインポートして設定を上書きしますか？";
export const EXPORT_CSV_LABEL = "エクスポート";
export const EXPORT_CSV_TITLE = "CSVとしてエクスポート";
export const CANCEL = "キャンセル";
export const VIEWER_ROW_TITLE = "ダブルクリックで設定場所へ移動";
export const ROLE_SPAWN_RATE = "スポーンレート";
export const ROLE_SPAWN_COUNT = "数";
export const CLOSE = "閉じる";
export const CONFIRM = "確定";
export const PRESET_SWITCH_TITLE = "プリセットの切り替え";
export const PRESET_SWITCH_MESSAGE =
	"プリセットを「{0}」から「{1}」に切り替えます";
export const PRESET_INPUT_PLACEHOLDER = "プリセット名を入力...";
export const AU_SETTINGS_TITLE = "AmongUsの設定";
export const EXR_SETTINGS_TITLE = "ExRの設定";
export const EXR_CONTENT_TEMP = "ExRの設定コンテンツ";

export const ROLE_FILTER_ADD_TITLE = "フィルター追加: 役職の選択";
export const ROLE_FILTER_ADD_BUTTON = "フィルターを追加";
export const ROLE_FILTER_UNKNOWN_ROLE = "Unknown Role";
export const ROLE_FILTER_ROLE_ADD_TITLE = "役職の追加";
export const ROLE_FILTER_ASSIGN_NUM_LABEL = "AssignNum: {0}";
export const ROLE_FILTER_ROLE_ADD_BUTTON = "役職を追加";
export const ROLE_FILTER_EMPTY_MESSAGE =
	"フィルターがありません。「フィルターを追加」ボタンから作成してください。";
export const ROLE_FILTER_DELETE_CONFIRM_TITLE = "フィルターの削除";
export const ROLE_FILTER_DELETE_CONFIRM_MESSAGE =
	"このフィルターを削除してもよろしいですか？";
export const ROLE_FILTER_ROLE_DELETE_CONFIRM_TITLE = "役職の削除";
export const ROLE_FILTER_ROLE_DELETE_CONFIRM_MESSAGE =
	"役職「{0}」をフィルターから削除してもよろしいですか？";
export const ROLE_FILTER_NO_ROLES = "No roles selected";
export const ROLE_SELECT_SEARCH_PLACEHOLDER = "役職を検索...";
export const OPTION_SEARCH_PLACEHOLDER = "オプションを検索...";
export const ROLE_SELECT_DEFAULT_TITLE = "役職の選択";
export const CSV_FILE_DESCRIPTION = "CSV File";

export const SYNCHRONIZING = "Synchronizing...";
export const RIGHT_PANEL_TITLE = "Right Panel";
export const AU_OPTIONS_TITLE = "Among Us";

export const SETTINGS_TITLE = "設定";
export const ROLE_FILTER_SHORT_LABEL = "R";
export const ON = "ON";
export const OFF = "OFF";
export const RANDOM_MAP_LABEL = "ランダム";

export const NOT_FOUND = "見つかりませんでした";
export const SETTINGS_UNDER_PREPARATION = "設定項目は現在準備中です。";
export const OK = "OK";

export const SEARCH_NO_RESULTS = "Search No Results";

export const CLIPBOARD_SETTING_TITLE = "設定";
export const CLIPBOARD_FACTION_COUNTS = "陣営数";
export const CLIPBOARD_ROLES = "役職";
export const CLIPBOARD_CREW = "クルー";
export const CLIPBOARD_IMPOSTOR = "インポスター";
export const CLIPBOARD_NEUTRAL = "ニュートラル";
export const CLIPBOARD_LIBERAL = "リベラル";
export const CLIPBOARD_DETAILED_SETTINGS = "詳細設定";
export const CLIPBOARD_OTHERS = "その他";
export const CLIPBOARD_OTHERS_NOTE = "※ : 何かあればここに書くとよろし";
export const CLIPBOARD_VANILLA_SUFFIX = "※バニラ";

export const CLIPBOARD_COPY_BUTTON = "クリップボードにコピー";
export const CLIPBOARD_COPY_SUCCESS = "設定をクリップボードにコピーしました";

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
