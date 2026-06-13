/**
 * デザインシステムで使用するカラー定数
 * ここで値を変更することで、テスト調整が可能です。
 */

export const BASIC_TEXT_COLOR = {
  // Primary Text Color: 設定項目名など、最も重要なテキスト
  textPrimary: "text-[#0B1728]",

  // Secondary Text Color: 設定の補足説明、注釈、デフォルト値
  textSecondary: "text-[#52525B]",

  // Disabled Text Color/Tertiary Text Color: 無効な項目やプレースホルダー
  textTertiary: "text-[#A1A1AA]",
};

export const PRIMARY_ACTION_COLOR = {
  // Primary Action Color: 「保存」「追加」など、ユーザーが次に行うべき主要なアクションを示す色
  // ここを変更することで、主要なアクションボタンの色を一括で調整できます。
  primary: "bg-[#9CE1FD]",
  hover: "hover:bg-[#9CE1FD]/80 transition-colors",
  active: "active:bg-[#7DD3FC]",
};

export const SEMANTIC_COLORS = {
  // エラー色: 1300項目の中からエラー箇所を見つけ出すために必須。
  error: "#F43F5E",
  // 警告色
  warning: "#D97706",
  // 成功色
  success: "#16A34A",
  // 情報色
  info: "#818CF8",
};

// ニュートラルカラーの各レベルの16進数カラーコード
const NEUTRAL_HEX = {
  n1: '#F4F4F5',
  n2: '#D0D0D6',
  n3: '#E4E4E7',
  n4: '#FFFFFF',
  n5: '#FFFFFF',
  n6: '#a3a3a3',
  n7: '#737373',
};

export const NEUTRAL_COLORS = {

  // ホバーした時の色はn3かn4を/40か/30で悪

  // Level 1: Main Background (最背面背景)
  neutral1: {
    hex: NEUTRAL_HEX.n1,
    bg: `bg-[${NEUTRAL_HEX.n1}]`,
    border: `border-[${NEUTRAL_HEX.n1}]`,
    description: "アプリ全体のメイン背景色、最背面のレイヤーに使用します。",
  },
  // Level 2: Border / Input Border (標準的な枠線)
  neutral2: {
    hex: NEUTRAL_HEX.n2,
    bg: `bg-[${NEUTRAL_HEX.n2}]`,
    border: `border-[${NEUTRAL_HEX.n2}]`,
    description:
      "外枠のボーダーと背景との枠線などの意味が異なるコンポーネントを区切る強い枠線",
  },
  // Level 3: Separator / Light Border (区切り線、弱い枠線)
  neutral3: {
    hex: NEUTRAL_HEX.n3,
    bg: `bg-[${NEUTRAL_HEX.n3}]`,
    hover: `hover:bg-[${NEUTRAL_HEX.n3}]`,
    border: `border-[${NEUTRAL_HEX.n3}]`,
    description:
      "同じ要素同士を分ける区切り線（Separator）や、非常に弱い枠線に使用します。",
  },
  // Level 4: Surface / Card Background (コンテンツ面、カード背景)
  neutral4: {
    hex: NEUTRAL_HEX.n4,
    bg: `bg-[${NEUTRAL_HEX.n4}]`,
    border: `border-[${NEUTRAL_HEX.n4}]`,
    description:
      "メインコンポーネントの背景",
  },
  // Level 5: UserInputs (標準的な枠線)
  neutral5: {
    hex: NEUTRAL_HEX.n5,
    bg: `bg-[${NEUTRAL_HEX.n5}]`,
    border: `border-[${NEUTRAL_HEX.n5}]`,
    description:
      "最前面、ユーザーが操作する場所(入力欄)",
  },
};

export const SEARCH_HIGHLIGHT_COLOR = {
  // 検索ワードに一致した箇所を目立たせる色。
  ring: "ring-[#3b82f6]",
  // ハイライトが自動的に消えるまでの時間（ミリ秒）
  duration: 2000,
};

export const TYPOGRAPHY = {
  // サイドバー: ナビゲーション項目
  sidebar: {
    size: "text-base",
    weight: "font-semibold",
    description: "サイドバーのナビゲーション項目に使用します。",
  },
  // タブ: 選択項目の切り替え
  tab: {
    size: "text-base",
    weight: "font-medium",
    description: "タブのラベルに使用します。",
  },
  // ラベル: 標準的な項目のラベル表示
  label: {
    size: "text-base",
    weight: "font-normal",
    description: "ヘッダー等の標準的な項目のラベル表示に使用します。",
  },
  childlabel: {
    size: "text-sm",
    weight: "font-medium", // 組み込んだ時に見づらかったらfont-normalへ
    description: "アコーディオン内部に展開される子オプションのラベル表示に使用します",
  },
  // 小: 注釈、補足説明、セカンダリテキスト
  small: {
    size: "text-xs",
    weight: "font-normal",
    description: "注釈や補足説明などのセカンダリテキストに使用します。",
  },
};

export const DATA_FONT = {
  family: "font-mono",
  description: "IDや数値、設定値など、正確な読み取りが必要な箇所に使用します。等幅フォントを使用することで、数値の桁揃えやIDの視認性を向上させます。",
};

export const LINE_HEIGHT = {
  // 行間（Line Height）の定義: 情報密度が高いため、詰まりすぎず、かつ離れすぎない最適な行間（1.5〜1.7倍）を設定。
  standard: "leading-[1.5]",
  description: "情報密度が高いため、詰まりすぎず、かつ離れすぎない最適な行間（1.5〜1.7倍）を設定します。",
};

function createGrid(size: number, description: string) {
  return {
    value: size,
    px: `${4 * size}px`,
    padding: `p-${size}`,
    paddingX: `px-${size}`,
    paddingY: `py-${size}`,
    paddingTop: `pt-${size}`,
    paddingBottom: `pb-${size}`,
    paddingLeft: `pl-${size}`,
    paddingRight: `pr-${size}`,
    margin: `m-${size}`,
    marginX: `mx-${size}`,
    marginY: `my-${size}`,
    marginTop: `mt-${size}`,
    marginBottom: `mb-${size}`,
    marginLeft: `ml-${size}`,
    marginRight: `mr-${size}`,
    gap: `gap-${size}`,
    description: description
  }
}

export const GRID_SYSTEM = {
  // 余白を8の倍数で固定。感覚ではなくルールで項目間の距離を制御。
  spacing: {
    small: createGrid(1, "超小単位。非常に密接な要素間の距離に使用します。"),
    base: createGrid(2, "要素内の細かな余白や、密接な関係にある要素間の距離に使用します。"),
    large: createGrid(3, "中間単位。標準より少し詰めたい場合に使用します。"),
    xLarge: createGrid(4, "標準単位。カードのパディングや、一般的な項目間の距離に使用します。"),
  },
  description: "余白を8？の倍数で固定。感覚ではなくルールで項目間の距離を制御します。",
};
