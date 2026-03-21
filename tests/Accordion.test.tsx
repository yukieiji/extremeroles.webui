import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from '../src/components/parts/Accordion';

describe('Accordion', () => {
  it('should display title and content when open', () => {
    const onToggle = vi.fn();
    render(
      <Accordion title="Test Title" isOpen={true} onToggle={onToggle}>
        <div>Test Content</div>
      </Accordion>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should handle toggle lifecycle (initial closed, open, close)', () => {
    const TestWrapper = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <Accordion
          title="Test Title"
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        >
          <div>Test Content</div>
        </Accordion>
      );
    };

    render(<TestWrapper />);
    const button = screen.getByRole('button');

    // 1. 初期状態: 閉じている
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // 閉じているときはコンテンツがレンダリングされないことを確認
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    // 2. 開く動作
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const content = screen.getByText('Test Content');
    const gridContainer = content.closest('.grid');
    expect(gridContainer).toHaveClass('grid-rows-[1fr]');

    // 3. 閉じる動作
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
});
