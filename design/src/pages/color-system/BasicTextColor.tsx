import { DESIGN_COLORS } from "../../designConstants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        <div className="p-4 border rounded">
          <div className="mb-4">
            <span className="text-xs text-gray-400 block mb-1">Tailwind Class: {DESIGN_COLORS.textPrimary}</span>
          </div>
          <div className="space-y-4 max-w-md">
             <div className="space-y-1">
                <Label className={DESIGN_COLORS.textPrimary}>プレイヤー名</Label>
                <Input defaultValue="ExtremePlayer" className={DESIGN_COLORS.textPrimary} />
             </div>
             <div className="flex items-center justify-between p-2">
              <span className={`font-medium ${DESIGN_COLORS.textPrimary}`}>設定項目：プレイヤーの最大数</span>
              <span className={DESIGN_COLORS.textPrimary}>10</span>
            </div>
            <Button variant="default" className={DESIGN_COLORS.textPrimary}>
                保存する
            </Button>
          </div>
        </div>
      </section>

      {/* Secondary Text Color */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold border-b">2. Secondary Text Color</h3>
          <p className={DESIGN_COLORS.textSecondary}>設定の補足説明、注釈、デフォルト値に使用します。</p>
        </div>
        <div className="p-4 border rounded">
          <div className="mb-4">
            <span className="text-xs text-gray-400 block mb-1">Tailwind Class: {DESIGN_COLORS.textSecondary}</span>
          </div>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className={DESIGN_COLORS.textPrimary}>通知設定</Label>
              <p className={`text-sm ${DESIGN_COLORS.textSecondary}`}>重要なアップデートがある場合のみ通知を送信します。</p>
            </div>
            <div className="p-2">
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
        <div className="p-4 border rounded">
          <div className="mb-4">
            <span className="text-xs text-gray-400 block mb-1">Tailwind Class: {DESIGN_COLORS.textTertiary}</span>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="space-y-1">
              <Label className={DESIGN_COLORS.textPrimary}>メールアドレス</Label>
              <Input placeholder="example@domain.com" className={`placeholder:${DESIGN_COLORS.textTertiary}`} />
              <p className={`text-xs ${DESIGN_COLORS.textTertiary}`}>※メールアドレスは後から変更できません</p>
            </div>
            <div className="flex items-center space-x-2 opacity-60 pointer-events-none">
              <input type="checkbox" disabled checked />
              <span className={`text-sm ${DESIGN_COLORS.textTertiary}`}>利用規約に同意する（無効な項目）</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
