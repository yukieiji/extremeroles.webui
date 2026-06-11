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

  const textColors = [
    { label: "Semantic", class: "", isSemantic: true },
    { label: "Primary", class: BASIC_TEXT_COLOR.textPrimary, isSemantic: false },
    { label: "Secondary", class: BASIC_TEXT_COLOR.textSecondary, isSemantic: false },
    { label: "Tertiary", class: BASIC_TEXT_COLOR.textTertiary, isSemantic: false },
  ];

  return (
    <div className="p-4 space-y-16">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>セマンティックカラー（状態色）</h2>
        <p className={`mb-6 text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>
          各セマンティックカラーに対して、4つのテキスト色（Semantic, Primary, Secondary, Tertiary）と3つのコンポーネントを組み合わせた計12個のサンプルを表示しています。
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {textColors.map((textColor) => (
              <div key={textColor.label} className="space-y-6 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-wider">{textColor.label} Text</div>

                {/* Badge Sample */}
                <div className="space-y-2">
                  <div className="text-[10px] opacity-30">Badge</div>
                  <Badge variant="outline" className="border-gray-200 flex items-center justify-center gap-1.5 h-6 px-2">
                    <state.icon className="size-3.5" style={{ color: state.color }} />
                    <span style={textColor.isSemantic ? { color: state.color } : {}} className={cn("leading-none", textColor.class)}>
                      {state.name}
                    </span>
                  </Badge>
                </div>

                {/* Button Sample */}
                <div className="space-y-2">
                  <div className="text-[10px] opacity-30">Button</div>
                  <Button variant="outline" className="border-gray-200 w-full justify-start h-9 px-3 gap-2">
                    <state.icon className="size-4 shrink-0" style={{ color: state.color }} />
                    <span style={textColor.isSemantic ? { color: state.color } : {}} className={cn("text-sm font-medium", textColor.class)}>
                      アクション
                    </span>
                  </Button>
                </div>

                {/* FieldError Sample */}
                <div className="space-y-2">
                  <div className="text-[10px] opacity-30">FieldError</div>
                  <div className="flex items-center gap-2 min-h-6">
                    <state.icon className="size-4 shrink-0" style={{ color: state.color }} />
                    <FieldError
                      style={textColor.isSemantic ? { color: state.color } : {}}
                      className={cn("text-[13px] leading-none m-0", textColor.class)}
                    >
                      補足メッセージ
                    </FieldError>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
