import { BASIC_TEXT_COLOR, TYPOGRAPHY_HIERARCHY, NEUTRAL_COLORS } from "../../designConstants";

export default function FontSizeWeight() {
  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">フォントサイズ・ウェイト階層</h2>
        <p className="mb-6 text-sm text-gray-500">
          デザイン定義チェックリストに基づいたフォントサイズ・ウェイトの階層です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">design/src/designConstants.ts</code> で階層ごとの設定を調整できます。
        </p>
      </div>

      {/* Sidebar Mock */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">1. サイドバー (Sidebar)</h3>
          <div className="flex gap-4 text-sm">
            <span>サイズ: {TYPOGRAPHY_HIERARCHY.sidebar.size}</span>
            <span>ウェイト: {TYPOGRAPHY_HIERARCHY.sidebar.weight}</span>
          </div>
          <p className="text-sm opacity-70 mt-1">{TYPOGRAPHY_HIERARCHY.sidebar.description}</p>
        </div>
        <div
          className="max-w-xs border rounded-lg overflow-hidden"
          style={{ backgroundColor: NEUTRAL_COLORS.neutral7.hex, borderColor: NEUTRAL_COLORS.neutral6.hex }}
        >
          <div className="p-4 space-y-2">
            <div
              className={`flex items-center gap-3 p-2 rounded text-white ${TYPOGRAPHY_HIERARCHY.sidebar.size} ${TYPOGRAPHY_HIERARCHY.sidebar.weight}`}
              style={{ backgroundColor: NEUTRAL_COLORS.neutral6.hex }}
            >
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
              <span>Among Us 設定</span>
            </div>
            <div className={`flex items-center gap-3 p-2 rounded transition-colors text-white/70 ${TYPOGRAPHY_HIERARCHY.sidebar.size} ${TYPOGRAPHY_HIERARCHY.sidebar.weight}`}>
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
              <span>役職フィルター</span>
            </div>
            <div className={`flex items-center gap-3 p-2 rounded transition-colors text-white/70 ${TYPOGRAPHY_HIERARCHY.sidebar.size} ${TYPOGRAPHY_HIERARCHY.sidebar.weight}`}>
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
              <span>全般設定</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Mock */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">2. タブ (Tabs)</h3>
          <div className="flex gap-4 text-sm">
            <span>サイズ: {TYPOGRAPHY_HIERARCHY.tab.size}</span>
            <span>ウェイト: {TYPOGRAPHY_HIERARCHY.tab.weight}</span>
          </div>
          <p className="text-sm opacity-70 mt-1">{TYPOGRAPHY_HIERARCHY.tab.description}</p>
        </div>
        <div
          className="max-w-md border rounded-lg p-4"
          style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex, borderColor: NEUTRAL_COLORS.neutral4.hex }}
        >
          <div
            className="flex p-1 rounded-md"
            style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex }}
          >
            <div
              className={`flex-1 text-center py-1.5 rounded shadow-sm ${BASIC_TEXT_COLOR.textPrimary} ${TYPOGRAPHY_HIERARCHY.tab.size} ${TYPOGRAPHY_HIERARCHY.tab.weight}`}
              style={{ backgroundColor: NEUTRAL_COLORS.neutral1.hex }}
            >
              全般
            </div>
            <div className={`flex-1 text-center py-1.5 rounded ${BASIC_TEXT_COLOR.textSecondary} ${TYPOGRAPHY_HIERARCHY.tab.size} ${TYPOGRAPHY_HIERARCHY.tab.weight}`}>
              インポスター
            </div>
            <div className={`flex-1 text-center py-1.5 rounded ${BASIC_TEXT_COLOR.textSecondary} ${TYPOGRAPHY_HIERARCHY.tab.size} ${TYPOGRAPHY_HIERARCHY.tab.weight}`}>
              クルーメイト
            </div>
          </div>
        </div>
      </section>

      {/* Label & Small Mock */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">3. ラベル & 小 (Label & Small)</h3>
          <div className="space-y-2">
            <div className="flex gap-4 text-sm">
              <span className="font-bold">Label:</span>
              <span>サイズ: {TYPOGRAPHY_HIERARCHY.label.size}</span>
              <span>ウェイト: {TYPOGRAPHY_HIERARCHY.label.weight}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="font-bold">Small:</span>
              <span>サイズ: {TYPOGRAPHY_HIERARCHY.small.size}</span>
              <span>ウェイト: {TYPOGRAPHY_HIERARCHY.small.weight}</span>
            </div>
          </div>
          <p className="text-sm opacity-70 mt-1">Label: {TYPOGRAPHY_HIERARCHY.label.description}</p>
          <p className="text-sm opacity-70">Small: {TYPOGRAPHY_HIERARCHY.small.description}</p>
        </div>

        <div className="max-w-md space-y-4">
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: NEUTRAL_COLORS.neutral2.hex, borderColor: NEUTRAL_COLORS.neutral5.hex }}
          >
            <h4 className={`mb-3 border-b pb-1 font-bold ${BASIC_TEXT_COLOR.textPrimary}`} style={{ borderColor: NEUTRAL_COLORS.neutral4.hex }}>ViewerOptionRow モック</h4>
            <div className="space-y-1">
              {/* Mock Row 1 */}
              <div className="flex justify-between items-center py-1 px-2 rounded transition-colors group">
                <span className={`${TYPOGRAPHY_HIERARCHY.label.size} ${TYPOGRAPHY_HIERARCHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
                  インポスターの数
                </span>
                <span className={`${TYPOGRAPHY_HIERARCHY.small.size} ${TYPOGRAPHY_HIERARCHY.small.weight} text-blue-600 font-medium`}>
                  2
                </span>
              </div>
              {/* Mock Row 2 */}
              <div
                className="flex justify-between items-center py-1 px-2 rounded transition-colors group"
                style={{ backgroundColor: NEUTRAL_COLORS.neutral3.hex }}
              >
                <span className={`${TYPOGRAPHY_HIERARCHY.label.size} ${TYPOGRAPHY_HIERARCHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
                  緊急会議ボタンのクールダウン
                </span>
                <span className={`${TYPOGRAPHY_HIERARCHY.small.size} ${TYPOGRAPHY_HIERARCHY.small.weight} text-blue-600 font-medium`}>
                  20.0s
                </span>
              </div>
              {/* Mock with annotation */}
              <div className="pt-2 px-2">
                <p className={`${TYPOGRAPHY_HIERARCHY.small.size} ${TYPOGRAPHY_HIERARCHY.small.weight} ${BASIC_TEXT_COLOR.textSecondary}`}>
                  ※会議時間は投票時間を含まない正味の話し合い時間です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
