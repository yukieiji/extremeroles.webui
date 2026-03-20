import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExROptionEditor } from '../src/feature/ExROptionEditor';
import { AuOptionEditor } from '../src/feature/AuOptionEditor';
import type { ExRTabDto, AuOptionCategoryDto } from '../src/type';

describe('OptionEditor Components', () => {
  it('ExROptionEditor がデータを正しく表示すること', () => {
    const mockData: ExRTabDto[] = [
      {
        Id: 0,
        Name: 'Test Tab',
        Categories: [],
      },
    ];

    render(<ExROptionEditor data={mockData} />);

    // JSON 文字列が含まれていることを確認
    const pre = screen.getByText((content) => {
        return content.includes('"Name": "Test Tab"');
    });
    expect(pre).toBeTruthy();
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
