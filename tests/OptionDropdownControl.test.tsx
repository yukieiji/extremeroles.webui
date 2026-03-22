import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionDropdownControl } from '../src/components/parts/OptionDropdownControl';

describe('OptionDropdownControl', () => {
  const mockValues = ['Option A', 'Option B', 'Option C'];

  it('renders dropdown with correct options', () => {
    render(
      <OptionDropdownControl
        selection={1}
        values={mockValues}
        onChange={() => {}}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('1');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Option A');
    expect(options[1]).toHaveTextContent('Option B');
    expect(options[2]).toHaveTextContent('Option C');
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(
      <OptionDropdownControl
        selection={1}
        values={mockValues}
        onChange={onChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });

    expect(onChange).toHaveBeenCalledWith(2);
  });
});
