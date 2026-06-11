import { SEMANTIC_COLORS, BASIC_TEXT_COLOR } from "../../designConstants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SemanticColors() {
  const states = [
    {
      id: "error",
      name: "エラー色",
      description: "1300項目の中からエラー箇所を見つけ出すために必須。重大な問題や制限を示します。",
      icon: OctagonXIcon,
      color: SEMANTIC_COLORS.error,
    },
    {
      id: "warning",
      name: "警告色",
      description: "注意が必要な事項や、潜在的な問題を示します。",
      icon: TriangleAlertIcon,
      color: SEMANTIC_COLORS.warning,
    },
    {
      id: "success",
      name: "成功色",
      description: "アクションの完了や、正常な状態を示します。",
      icon: CircleCheckIcon,
      color: SEMANTIC_COLORS.success,
    },
    {
      id: "info",
      name: "情報色",
      description: "補足情報や、一般的な通知を示します。",
      icon: InfoIcon,
      color: SEMANTIC_COLORS.info,
    },
  ];

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>セマンティックカラー（状態色）</h2>
        <p className={`mb-6 text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>
          デザイン定義チェックリストに基づいた4種のセマンティックカラー（状態色）と、3種の基本テキストカラーの組み合わせテストです。
          計12個のサンプルを表示しています。
        </p>
      </div>

      {states.map((state) => (
        <section key={state.id} className="space-y-6">
          <div className="border-b pb-2">
            <div className="flex items-center gap-2">
              <state.icon className="size-5" style={{ color: state.color }} />
              <h3 className={`text-lg font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>{state.name}</h3>
            </div>
            <p className={`text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>{state.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sample 1: Text Primary */}
            <div className="space-y-3">
              <div className={`text-xs font-mono opacity-50`}>textPrimary × Badge</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(BASIC_TEXT_COLOR.textPrimary, "border-gray-200")}>
                  <state.icon className="size-3" style={{ color: state.color }} />
                  {state.name}通知
                </Badge>
              </div>
            </div>

            {/* Sample 2: Text Secondary */}
            <div className="space-y-3">
              <div className={`text-xs font-mono opacity-50`}>textSecondary × Button</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className={cn(BASIC_TEXT_COLOR.textSecondary, "border-gray-200")}>
                  <state.icon className="size-4" style={{ color: state.color }} />
                  アクションを実行
                </Button>
              </div>
            </div>

            {/* Sample 3: Text Tertiary */}
            <div className="space-y-3">
              <div className={`text-xs font-mono opacity-50`}>textTertiary × FieldError</div>
              <div className="flex items-start gap-2">
                <state.icon className="size-4 mt-0.5" style={{ color: state.color }} />
                <FieldError className={BASIC_TEXT_COLOR.textTertiary}>
                  {state.name}に関する補足メッセージです
                </FieldError>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
