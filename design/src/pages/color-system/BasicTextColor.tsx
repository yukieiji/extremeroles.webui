import { DESIGN_COLORS } from "../../designConstants";

export default function BasicTextColor() {
  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">基本テキストカラー</h2>
        <p className="mb-6">
          デザイン定義チェックリストに基づいた3種の基本テキストカラーです。
          <code className="bg-gray-100 p-1 rounded ml-2">design/src/designConstants.ts</code> で色味を調整できます。
        </p>
      </div>

      {/* Primary Text Color */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold border-b">1. Primary Text Color</h3>
          <p className={DESIGN_COLORS.textSecondary}>設定項目名など、最も重要なテキストに使用します。</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Tailwind Class: {DESIGN_COLORS.textPrimary}</span>
            <div className={`text-xl font-bold ${DESIGN_COLORS.textPrimary}`}>
              これはプライマリテキストです（サンプル）
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className={`font-medium ${DESIGN_COLORS.textPrimary}`}>設定項目：プレイヤーの最大数</span>
              <span className={DESIGN_COLORS.textPrimary}>10</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className={`font-medium ${DESIGN_COLORS.textPrimary}`}>設定項目：ゲームモード</span>
              <span className={DESIGN_COLORS.textPrimary}>クラシック</span>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Text Color */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold border-b">2. Secondary Text Color</h3>
          <p className={DESIGN_COLORS.textSecondary}>設定の補足説明、注釈、デフォルト値に使用します。</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Tailwind Class: {DESIGN_COLORS.textSecondary}</span>
            <div className={`text-base ${DESIGN_COLORS.textSecondary}`}>
              これはセカンダリテキストです（サンプル）
            </div>
          </div>
          <div className="space-y-4 p-2 bg-gray-50 rounded">
            <div>
              <div className={`font-medium ${DESIGN_COLORS.textPrimary}`}>通知設定</div>
              <div className={`text-sm ${DESIGN_COLORS.textSecondary}`}>重要なアップデートがある場合のみ通知を送信します。</div>
            </div>
            <div>
              <div className={`font-medium ${DESIGN_COLORS.textPrimary}`}>表示言語</div>
              <div className={`text-sm ${DESIGN_COLORS.textSecondary}`}>デフォルト：日本語</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tertiary / Disabled Text Color */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold border-b">3. Disabled Text Color / Tertiary Text Color</h3>
          <p className={DESIGN_COLORS.textSecondary}>無効な項目やプレースホルダーに使用します。</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Tailwind Class: {DESIGN_COLORS.textTertiary}</span>
            <div className={`text-base ${DESIGN_COLORS.textTertiary}`}>
              これはターシャリ/無効テキストです（サンプル）
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${DESIGN_COLORS.textPrimary} mb-1`}>メールアドレス</label>
              <div className="px-3 py-2 border rounded bg-white">
                <span className={DESIGN_COLORS.textTertiary}>example@domain.com（プレースホルダー）</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 opacity-60">
              <input type="checkbox" disabled checked />
              <span className={DESIGN_COLORS.textTertiary}>利用規約に同意する（無効な項目）</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
