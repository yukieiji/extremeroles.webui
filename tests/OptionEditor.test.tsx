import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuOptionEditor } from '../src/feature/AuOptionEditor';
import type { AuOptionCategoryDto } from '../src/type';

describe('OptionEditor Components', () => {
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
