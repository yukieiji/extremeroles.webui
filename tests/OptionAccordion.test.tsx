import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionAccordion } from '../src/components/blocks/OptionAccordion';

describe('OptionAccordion', () => {
  it('renders optionItem and handles toggle', () => {
    const onToggle = vi.fn();
    render(
      <OptionAccordion
        optionItem={<span>Parent Option</span>}
        isOpen={false}
        onToggle={onToggle}
      >
        <div>Child Content</div>
      </OptionAccordion>
    );

    expect(screen.getByText('Parent Option')).toBeInTheDocument();

    const toggleButton = screen.getByLabelText('開く');
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows/hides children based on isOpen', () => {
    const { rerender } = render(
      <OptionAccordion
        optionItem={<span>Parent</span>}
        isOpen={false}
        onToggle={() => {}}
      >
        <div>Child Content</div>
      </OptionAccordion>
    );

    expect(screen.queryByText('Child Content')).not.toBeInTheDocument();

    rerender(
      <OptionAccordion
        optionItem={<span>Parent</span>}
        isOpen={true}
        onToggle={() => {}}
      >
        <div>Child Content</div>
      </OptionAccordion>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
