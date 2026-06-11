import { BASIC_TEXT_COLOR, PRIMARY_ACTION_COLOR } from "../../designConstants";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RefreshCw, Download } from "lucide-react";
import {
  SYNC_BUTTON_TITLE,
  SYNC_BUTTON_ARIA,
  EXPORT_CSV_LABEL,
  EXPORT_CSV_TITLE,
  ROLE_FILTER_ADD_BUTTON,
} from "@/noTrans";

export default function PrimaryActionColor() {
  const primaryActionClass = `${PRIMARY_ACTION_COLOR.primary} ${BASIC_TEXT_COLOR.textPrimary}`;

  const handleDummyClick = (name: string) => {
    console.log(`${name} clicked`);
    alert(`${name}がクリックされました`);
  };

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>
          プライマリーアクション色
        </h2>
        <p className={`mb-6 text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>
          「保存」「追加」など、ユーザーが次に行うべき主要なアクションを示す色です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">
            design/src/designConstants.ts
          </code>{" "}
          で色味を調整できます。
        </p>
      </div>

      <section className="space-y-4">
        <div className={`border-b pb-2 ${BASIC_TEXT_COLOR.textPrimary}`}>
          <h3 className="text-lg font-semibold">現在の設定</h3>
          <div className="flex gap-4 items-center mt-2">
            <span>
              Primary:{" "}
              <code className="bg-gray-100 p-1 rounded text-black">
                {PRIMARY_ACTION_COLOR.primary}
              </code>
            </span>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          {/* SyncButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>
              SyncButton (同期ボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("SyncButton")}
                title={SYNC_BUTTON_TITLE}
                aria-label={SYNC_BUTTON_ARIA}
                className={primaryActionClass}
              >
                <RefreshCw size={20} aria-hidden="true" />
              </Button>
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>
                アイコンのみの主要アクション
              </span>
            </div>
          </div>

          {/* ExportButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>
              ExportButton (エクスポートボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("ExportButton")}
                title={EXPORT_CSV_TITLE}
                aria-label={EXPORT_CSV_TITLE}
                className={primaryActionClass}
              >
                <Download />
                {EXPORT_CSV_LABEL}
              </Button>
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>
                アイコンとテキストの主要アクション
              </span>
            </div>
          </div>

          {/* RoleFilterAddButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>
              RoleFilterAddButton (フィルター追加ボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("RoleFilterAddButton")}
                className={primaryActionClass}
              >
                <Plus size={20} className="mr-1" aria-hidden="true" />
                {ROLE_FILTER_ADD_BUTTON}
              </Button>
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>
                機能を含む主要アクションボタンの見た目
              </span>
            </div>
          </div>

          {/* Simple Icon Buttons Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>
              Simple Icon Buttons (+ / -)
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  className={primaryActionClass}
                  onClick={() => handleDummyClick("Plus Button")}
                >
                  <Plus size={20} />
                </Button>
                <Button
                  size="icon"
                  className={primaryActionClass}
                  onClick={() => handleDummyClick("Minus Button")}
                >
                  <Minus size={20} />
                </Button>
              </div>
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>
                シンプルな追加・削除ボタンの例
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
