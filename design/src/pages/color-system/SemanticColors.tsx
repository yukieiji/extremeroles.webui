import { SEMANTIC_COLORS, BASIC_TEXT_COLOR } from "../../designConstants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SemanticColors() {
  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>セマンティックカラー（状態色）</h2>
        <p className={`mb-6 text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>
          デザイン定義チェックリストに基づいた4種のセマンティックカラー（状態色）です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">design/src/designConstants.ts</code> で色味を調整できます。
        </p>
      </div>

      {/* Error Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <OctagonXIcon className="size-5" style={{ color: SEMANTIC_COLORS.error }} />
            <h3 className={`text-lg font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>エラー色</h3>
          </div>
          <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>1300項目の中からエラー箇所を見つけ出すために必須。重大な問題や制限を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Badge</div>
            <Badge variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
              <OctagonXIcon className="size-3" style={{ color: SEMANTIC_COLORS.error }} />
              エラーが発生しました
            </Badge>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Button</div>
            <Button variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
               <OctagonXIcon className="size-4" style={{ color: SEMANTIC_COLORS.error }} />
               削除する
            </Button>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>FieldError (Icon only color)</div>
            <div className="flex items-start gap-2">
               <OctagonXIcon className="size-4 mt-0.5" style={{ color: SEMANTIC_COLORS.error }} />
               <FieldError className={BASIC_TEXT_COLOR.textPrimary}>
                 この項目は必須入力です。
               </FieldError>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <TriangleAlertIcon className="size-5" style={{ color: SEMANTIC_COLORS.warning }} />
            <h3 className={`text-lg font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>警告色</h3>
          </div>
          <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>注意が必要な事項や、潜在的な問題を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Badge</div>
            <Badge variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
              <TriangleAlertIcon className="size-3" style={{ color: SEMANTIC_COLORS.warning }} />
              確認が必要です
            </Badge>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Button</div>
            <Button variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
               <TriangleAlertIcon className="size-4" style={{ color: SEMANTIC_COLORS.warning }} />
               無視して続行
            </Button>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Text Sample</div>
            <div className="flex items-center gap-1.5">
               <TriangleAlertIcon className="size-4" style={{ color: SEMANTIC_COLORS.warning }} />
               <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>未保存の変更があります。</span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <CircleCheckIcon className="size-5" style={{ color: SEMANTIC_COLORS.success }} />
            <h3 className={`text-lg font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>成功色</h3>
          </div>
          <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>アクションの完了や、正常な状態を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Badge</div>
            <Badge variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
              <CircleCheckIcon className="size-3" style={{ color: SEMANTIC_COLORS.success }} />
              保存しました
            </Badge>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Button</div>
            <Button variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
               <CircleCheckIcon className="size-4" style={{ color: SEMANTIC_COLORS.success }} />
               完了
            </Button>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Icon & Text</div>
            <div className="flex items-center gap-1.5">
              <CircleCheckIcon className="size-4" style={{ color: SEMANTIC_COLORS.success }} />
              <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>同期済み</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Color */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex items-center gap-2">
            <InfoIcon className="size-5" style={{ color: SEMANTIC_COLORS.info }} />
            <h3 className={`text-lg font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>情報色</h3>
          </div>
          <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>補足情報や、一般的な通知を示します。</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Badge</div>
            <Badge variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
              <InfoIcon className="size-3" style={{ color: SEMANTIC_COLORS.info }} />
              ヒント
            </Badge>
          </div>
          <div className="space-y-2">
            <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Button</div>
            <Button variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary)}>
               <InfoIcon className="size-4" style={{ color: SEMANTIC_COLORS.info }} />
               詳細を表示
            </Button>
          </div>
          <div className="space-y-2">
             <div className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>Icon & Text</div>
             <div className="flex items-center gap-1.5">
               <InfoIcon className="size-4" style={{ color: SEMANTIC_COLORS.info }} />
               <span className={cn("text-sm font-medium", BASIC_TEXT_COLOR.textPrimary)}>アップデートがあります</span>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
