import { ExRTabSelector } from './ExRTabSelector';
import { ExRCategoryList } from './ExRCategoryList';
import type { ExRTabDto } from '../type';

interface ExROptionEditorProps {
  data: ExRTabDto[];
}

/**
 * ExRオプションを表示するコンポーネント。
 * 子コンポーネントに状態を分散させることで、再レンダリングの範囲を最小限に抑えています。
 */
export function ExROptionEditor({ data }: ExROptionEditorProps) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-gray-500">No ExR options available.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ExRTabSelector tabs={data} />
      <ExRCategoryList tabs={data} />
    </div>
  );
}
