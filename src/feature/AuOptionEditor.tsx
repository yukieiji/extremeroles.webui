import type { AuOptionCategoryDto } from '../type';

interface AuOptionEditorProps {
  data: AuOptionCategoryDto[];
}

/**
 * Auオプションを表示するコンポーネント
 */
export function AuOptionEditor({ data }: AuOptionEditorProps) {
  return (
    <div className="bg-gray-800 text-green-400 p-6 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
