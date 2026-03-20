import { describe, it, expect, vi } from 'vitest';
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

  it('should call onToggle when button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <Accordion title="Test Title" isOpen={false} onToggle={onToggle}>
        <div>Test Content</div>
      </Accordion>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should not render content when closed', () => {
    const onToggle = vi.fn();
    render(
      <Accordion title="Test Title" isOpen={false} onToggle={onToggle}>
        <div>Test Content</div>
      </Accordion>
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
});
