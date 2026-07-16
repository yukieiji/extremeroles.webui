import { useDesignTheme } from "../../themeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SemanticColors() {
  const { semanticColors, basicTextColor } = useDesignTheme();

  const states = [
    {
      id: "error",
      name: "エラー色",
      description: "1300項目の中からエラー箇所を見つけ出すために必須。重大な問題や制限を示します。",
      icon: OctagonXIcon,
      color: semanticColors.error,
    },
    {
      id: "warning",
      name: "警告色",
      description: "注意が必要な事項や、潜在的な問題を示します。",
      icon: TriangleAlertIcon,
      color: semanticColors.warning,
    },
    {
      id: "success",
      name: "成功色",
      description: "アクションの完了や、正常な状態を示します。",
      icon: CircleCheckIcon,
      color: semanticColors.success,
    },
    {
      id: "info",
      name: "情報色",
      description: "補足情報や、一般的な通知を示します。",
      icon: InfoIcon,
      color: semanticColors.info,
    },
  ];

  const textColors = [
    { label: "Semantic", class: "", isSemantic: true },
    { label: "Primary", class: basicTextColor.textPrimary, isSemantic: false },
    { label: "Secondary", class: basicTextColor.textSecondary, isSemantic: false },
    { label: "Tertiary", class: basicTextColor.textTertiary, isSemantic: false },
  ];

  return (
    <div className="p-4 space-y-16">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${basicTextColor.textPrimary}`}>セマンティックカラー（状態色）</h2>
        <p className={`mb-6 text-sm ${basicTextColor.textSecondary}`}>
          各セマンティックカラーに対して、4つのテキスト色（Semantic, Primary, Secondary, Tertiary）と3つのコンポーネントを組み合わせた計12個のサンプルを表示しています。
        </p>
      </div>

      {states.map((state) => (
        <section key={state.id} className="space-y-6">
          <div className="border-b pb-2">
            <div className="flex items-center gap-2">
              <state.icon className="size-5" style={{ color: state.color }} />
              <h3 className={`text-lg font-semibold ${basicTextColor.textPrimary}`}>{state.name}</h3>
            </div>
            <p className={`text-sm ${basicTextColor.textSecondary}`}>{state.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
            {textColors.map((textColor) => (
              <div key={textColor.label} className="space-y-6">
                <div className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800 pb-1">{textColor.label} Text</div>

                {/* Badge Sample */}
                <div className="space-y-1.5">
                  <div className="text-[10px] opacity-30 font-medium">Badge</div>
                  <Badge variant="outline" className="border-gray-200 dark:border-neutral-800 flex items-center w-fit gap-1.5 h-6 px-2 py-0">
                    <state.icon className="size-3.5 shrink-0" style={{ color: state.color }} />
                    <span style={textColor.isSemantic ? { color: state.color } : {}} className={cn("leading-none translate-y-[0.5px]", textColor.class)}>
                      {state.name}
                    </span>
                  </Badge>
                </div>

                {/* Button Sample */}
                <div className="space-y-1.5">
                  <div className="text-[10px] opacity-30 font-medium">Button</div>
                  <Button variant="outline" className="border-gray-200 dark:border-neutral-800 flex items-center w-fit gap-2 h-9 px-3 py-0">
                    <state.icon className="size-4 shrink-0" style={{ color: state.color }} />
                    <span style={textColor.isSemantic ? { color: state.color } : {}} className={cn("text-sm font-medium leading-none translate-y-[0.5px]", textColor.class)}>
                      アクション
                    </span>
                  </Button>
                </div>

                {/* FieldError Sample */}
                <div className="space-y-1.5">
                  <div className="text-[10px] opacity-30 font-medium">FieldError</div>
                  <div className="flex items-center gap-2 min-h-5 py-0.5">
                    <state.icon className="size-4 shrink-0" style={{ color: state.color }} />
                    <FieldError
                      style={textColor.isSemantic ? { color: state.color } : {}}
                      className={cn("text-[13px] leading-none m-0 translate-y-[0.5px]", textColor.class)}
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
