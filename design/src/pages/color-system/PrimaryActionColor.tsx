import { BASIC_TEXT_COLOR, PRIMARY_ACTION_COLOR } from "../../designConstants";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RefreshCw, Download } from "lucide-react";
import { translationMetaData } from "@/logics/api";

export default function PrimaryActionColor() {
  const primaryActionClass = `${PRIMARY_ACTION_COLOR.primary} ${BASIC_TEXT_COLOR.textPrimary}`;

  const handleDummyClick = (name: string) => {
    console.log(`${name} clicked`);
  };

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          プライマリーアクション色
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          「保存」「追加」など、ユーザーが次に行うべき主要なアクションを示す色です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">
            design/src/designConstants.ts
          </code>{" "}
          で色味を調整できます。
        </p>
      </div>

      <section className="space-y-4">
        <div className="border-b pb-2">
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
            <h4 className="text-sm font-medium text-gray-500">
              SyncButton (同期ボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("SyncButton")}
                title={translationMetaData.SYNC_BUTTON_TITLE}
                aria-label={translationMetaData.SYNC_BUTTON_TITLE}
                className={primaryActionClass}
              >
                <RefreshCw size={20} aria-hidden="true" />
              </Button>
              <span className="text-xs text-gray-400">
                アイコンのみの主要アクション
              </span>
            </div>
          </div>

          {/* ExportButton Sample */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
              ExportButton (エクスポートボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("ExportButton")}
                title={translationMetaData.EXPORT_CSV_TITLE}
                aria-label={translationMetaData.EXPORT_CSV_TITLE}
                className={primaryActionClass}
              >
                <Download />
                {translationMetaData.EXPORT_CSV_LABEL}
              </Button>
              <span className="text-xs text-gray-400">
                アイコンとテキストの主要アクション
              </span>
            </div>
          </div>

          {/* RoleFilterAddButton Sample */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
              RoleFilterAddButton (フィルター追加ボタン) の再現
            </h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleDummyClick("RoleFilterAddButton")}
                className={primaryActionClass}
              >
                <Plus size={20} className="mr-1" aria-hidden="true" />
                {translationMetaData.ROLE_FILTER_ADD_BUTTON}
              </Button>
              <span className="text-xs text-gray-400">
                機能を含む主要アクションボタンの見た目
              </span>
            </div>
          </div>

          {/* Simple Icon Buttons Sample */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
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
              <span className="text-xs text-gray-400">
                シンプルな追加・削除ボタンの例
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
