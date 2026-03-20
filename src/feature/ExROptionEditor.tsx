import type { ExRTabDto } from '../type';

interface ExROptionEditorProps {
  data: ExRTabDto[];
}

/**
 * ExRオプションを表示するコンポーネント
 */
export function ExROptionEditor({ data }: ExROptionEditorProps) {
  return (
    <div className="bg-gray-800 text-green-400 p-6 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
