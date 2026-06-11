import { SEMANTIC_COLORS } from "../../designConstants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SemanticColors() {
  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">セマンティックカラー（状態色）</h2>
        <p className="mb-6 text-sm text-gray-500">
          デザイン定義チェックリストに基づいた4種のセマンティックカラー（状態色）です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">design/src/designConstants.ts</code> で色味を調整できます。
        </p>
      </div>

      {/* Error Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <OctagonXIcon className={cn("size-5", SEMANTIC_COLORS.error.text)} />
            <h3 className="text-lg font-semibold">エラー色</h3>
          </div>
          <p className="text-sm opacity-70">1300項目の中からエラー箇所を見つけ出すために必須。重大な問題や制限を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Badge (Custom)</div>
            <Badge className={cn("border-transparent", SEMANTIC_COLORS.error.softBg, SEMANTIC_COLORS.error.text)}>
              <OctagonXIcon className="size-3" />
              エラーが発生しました
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Button (Custom Soft)</div>
            <Button variant="outline" className={cn(SEMANTIC_COLORS.error.text, SEMANTIC_COLORS.error.softBg, "border-transparent")}>
              削除する
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">FieldError</div>
            <FieldError className={SEMANTIC_COLORS.error.text}>
              この項目は必須入力です。
            </FieldError>
          </div>
        </div>
      </section>

      {/* Warning Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <TriangleAlertIcon className={cn("size-5", SEMANTIC_COLORS.warning.text)} />
            <h3 className="text-lg font-semibold">警告色</h3>
          </div>
          <p className="text-sm opacity-70">注意が必要な事項や、潜在的な問題を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Badge (Custom)</div>
            <Badge className={cn("border-transparent", SEMANTIC_COLORS.warning.softBg, SEMANTIC_COLORS.warning.text)}>
              <TriangleAlertIcon className="size-3" />
              確認が必要です
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Button (Custom Soft)</div>
            <Button variant="outline" className={cn(SEMANTIC_COLORS.warning.text, SEMANTIC_COLORS.warning.softBg, "border-transparent")}>
              無視して続行
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Text Sample</div>
            <p className={cn("text-sm font-medium", SEMANTIC_COLORS.warning.text)}>
              未保存の変更があります。
            </p>
          </div>
        </div>
      </section>

      {/* Success Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <CircleCheckIcon className={cn("size-5", SEMANTIC_COLORS.success.text)} />
            <h3 className="text-lg font-semibold">成功色</h3>
          </div>
          <p className="text-sm opacity-70">アクションの完了や、正常な状態を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Badge (Custom)</div>
            <Badge className={cn("border-transparent", SEMANTIC_COLORS.success.softBg, SEMANTIC_COLORS.success.text)}>
              <CircleCheckIcon className="size-3" />
              保存しました
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Button (Custom Soft)</div>
            <Button variant="outline" className={cn(SEMANTIC_COLORS.success.text, SEMANTIC_COLORS.success.softBg, "border-transparent")}>
              完了
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Icon & Text</div>
            <div className="flex items-center gap-1.5">
              <CircleCheckIcon className={cn("size-4", SEMANTIC_COLORS.success.text)} />
              <span className={cn("text-sm font-medium", SEMANTIC_COLORS.success.text)}>同期済み</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <InfoIcon className={cn("size-5", SEMANTIC_COLORS.info.text)} />
            <h3 className="text-lg font-semibold">情報色</h3>
          </div>
          <p className="text-sm opacity-70">補足情報や、一般的な通知を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Badge (Custom)</div>
            <Badge className={cn("border-transparent", SEMANTIC_COLORS.info.softBg, SEMANTIC_COLORS.info.text)}>
              <InfoIcon className="size-3" />
              ヒント
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Button (Custom Soft)</div>
            <Button variant="outline" className={cn(SEMANTIC_COLORS.info.text, SEMANTIC_COLORS.info.softBg, "border-transparent")}>
              詳細を表示
            </Button>
          </div>
          <div className="space-y-2">
             <div className="text-xs text-gray-400">Icon & Text</div>
             <div className="flex items-center gap-1.5">
               <InfoIcon className={cn("size-4", SEMANTIC_COLORS.info.text)} />
               <span className={cn("text-sm font-medium", SEMANTIC_COLORS.info.text)}>アップデートがあります</span>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
