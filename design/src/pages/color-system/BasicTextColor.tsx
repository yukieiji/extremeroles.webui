import { DESIGN_COLORS } from "../../designConstants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BasicTextColor() {
  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">基本テキストカラー</h2>
        <p className="mb-6 text-sm text-gray-500">
          デザイン定義チェックリストに基づいた3種の基本テキストカラーです。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">design/src/designConstants.ts</code> で色味を調整できます。
        </p>
      </div>

      {/* Primary Text Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">1. Primary Text Color</h3>
          <span>現在の設定: {DESIGN_COLORS.textPrimary}</span>
          <p className="text-sm opacity-70">設定項目名など、最も重要なテキストに使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-2xl font-bold ${DESIGN_COLORS.textPrimary}`}>
              これはプライマリテキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
             <div className="space-y-1">
                <Label className={DESIGN_COLORS.textPrimary}>ユーザー設定項目ラベル</Label>
                <Input defaultValue="設定値のテキスト" className={DESIGN_COLORS.textPrimary} />
             </div>
             <div className="flex items-center justify-between py-2">
              <span className={`font-medium ${DESIGN_COLORS.textPrimary}`}>プレイヤーの最大数</span>
              <span className={DESIGN_COLORS.textPrimary}>10</span>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className={DESIGN_COLORS.textPrimary}>
                    アウトラインボタン
                </Button>
                <Button variant="ghost" className={DESIGN_COLORS.textPrimary}>
                    ゴーストボタン
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Text Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">2. Secondary Text Color</h3>
          <span>T現在の設定: {DESIGN_COLORS.textSecondary}</span>
          <p className="text-sm opacity-70">設定の補足説明、注釈、デフォルト値に使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-xl ${DESIGN_COLORS.textSecondary}`}>
              これはセカンダリテキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <Label className={DESIGN_COLORS.textPrimary}>通知設定</Label>
              <p className={`text-sm ${DESIGN_COLORS.textSecondary}`}>重要なアップデートがある場合のみ通知を送信します（補足説明）。</p>
            </div>
            <div className="py-2">
              <div className={`font-medium ${DESIGN_COLORS.textPrimary}`}>表示言語</div>
              <div className={`text-sm ${DESIGN_COLORS.textSecondary}`}>デフォルト：日本語（デフォルト値の表示）</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tertiary / Disabled Text Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">3. Disabled Text Color / Tertiary Text Color</h3>
            <span >Tailwind Class: {DESIGN_COLORS.textTertiary}</span>
          <p className="text-sm opacity-70">無効な項目やプレースホルダーに使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-lg ${DESIGN_COLORS.textTertiary}`}>
              これはターシャリ/無効テキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="space-y-1">
              <Label className={DESIGN_COLORS.textPrimary}>メールアドレス</Label>
              <Input placeholder="example@domain.com (プレースホルダー)" className={`placeholder:${DESIGN_COLORS.textTertiary}`} />
              <p className={`text-xs ${DESIGN_COLORS.textTertiary}`}>※メールアドレスは後から変更できません（注釈・小）</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" disabled checked className="opacity-30" />
              <span className={`text-sm ${DESIGN_COLORS.textTertiary}`}>利用規約に同意する（無効な項目のラベル）</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
