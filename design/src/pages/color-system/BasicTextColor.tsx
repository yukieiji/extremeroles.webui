import { BASIC_TEXT_COLOR } from "../../designConstants";
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
          <span>現在の設定: {BASIC_TEXT_COLOR.textPrimary}</span>
          <p className="text-sm opacity-70">設定項目名など、最も重要なテキストに使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-2xl font-bold ${BASIC_TEXT_COLOR.textPrimary}`}>
              これはプライマリテキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
             <div className="space-y-1">
                <Label className={BASIC_TEXT_COLOR.textPrimary}>ユーザー設定項目ラベル</Label>
                <Input defaultValue="設定値のテキスト" className={BASIC_TEXT_COLOR.textPrimary} />
             </div>
             <div className="flex items-center justify-between py-2">
              <span className={`font-medium ${BASIC_TEXT_COLOR.textPrimary}`}>プレイヤーの最大数</span>
              <span className={BASIC_TEXT_COLOR.textPrimary}>10</span>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className={BASIC_TEXT_COLOR.textPrimary}>
                    アウトラインボタン
                </Button>
                <Button variant="ghost" className={BASIC_TEXT_COLOR.textPrimary}>
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
          <span>現在の設定: {BASIC_TEXT_COLOR.textSecondary}</span>
          <p className="text-sm opacity-70">設定の補足説明、注釈、デフォルト値に使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-xl ${BASIC_TEXT_COLOR.textSecondary}`}>
              これはセカンダリテキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <Label className={BASIC_TEXT_COLOR.textPrimary}>通知設定</Label>
              <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>重要なアップデートがある場合のみ通知を送信します（補足説明）。</p>
            </div>
            <div className="py-2">
              <div className={`font-medium ${BASIC_TEXT_COLOR.textPrimary}`}>表示言語</div>
              <div className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>デフォルト：日本語（デフォルト値の表示）</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tertiary / Disabled Text Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">3. Disabled Text Color / Tertiary Text Color</h3>
            <span >現在の設定: {BASIC_TEXT_COLOR.textTertiary}</span>
          <p className="text-sm opacity-70">無効な項目やプレースホルダーに使用します。</p>
        </div>
        <div className="space-y-6">
          <div>
            <div className={`text-lg ${BASIC_TEXT_COLOR.textTertiary}`}>
              これはターシャリ/無効テキストです
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="space-y-1">
              <Label className={BASIC_TEXT_COLOR.textPrimary}>メールアドレス</Label>
              <Input placeholder="example@domain.com (プレースホルダー)" className={`placeholder:${BASIC_TEXT_COLOR.textTertiary}`} />
              <p className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>※メールアドレスは後から変更できません（注釈・小）</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" disabled checked className="opacity-30" />
              <span className={`text-sm ${BASIC_TEXT_COLOR.textTertiary}`}>利用規約に同意する（無効な項目のラベル）</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
