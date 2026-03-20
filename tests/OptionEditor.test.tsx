import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExROptionEditor } from '../src/feature/ExROptionEditor';
import { AuOptionEditor } from '../src/feature/AuOptionEditor';
import type { ExRTabDto, AuOptionCategoryDto } from '../src/type';

describe('OptionEditor Components', () => {
  it('ExROptionEditor がデータを正しく表示すること', () => {
    const mockData: ExRTabDto[] = [
      {
        Id: 0,
        Name: 'Test Tab 1',
        Categories: [],
      },
      {
        Id: 1,
        Name: 'Test Tab 2',
        Categories: [],
      },
    ];

    render(<ExROptionEditor data={mockData} />);

    // 最初は最初のタブの内容が表示されていることを確認
    const pre = screen.getByTestId('exr-json-pre');
    expect(pre.textContent).toContain('"Name": "Test Tab 1"');

    // タブ2をクリック
    const tab2Button = screen.getByText('Test Tab 2');
    fireEvent.click(tab2Button);

    // タブ2の内容が表示されていることを確認
    expect(pre.textContent).toContain('"Name": "Test Tab 2"');
  });

  it('AuOptionEditor がデータを正しく表示すること', () => {
    const mockData: AuOptionCategoryDto[] = [
      {
        TranslatedTitle: 'Test Category',
        Options: [],
      },
    ];

    render(<AuOptionEditor data={mockData} />);

    const pre = screen.getByText((content) => {
        return content.includes('"TranslatedTitle": "Test Category"');
    });
    expect(pre).toBeTruthy();
  });
});
