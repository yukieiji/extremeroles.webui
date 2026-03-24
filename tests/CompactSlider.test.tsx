import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompactSlider } from '../src/components/parts/CompactSlider';

describe('CompactSlider', () => {
  const defaultProps = {
    label: 'Test Label',
    values: [0, 10, 20],
    currentSelection: 1,
    onSelectionChange: vi.fn(),
    onInputChange: vi.fn(),
  };

  it('renders label and current value correctly', () => {
    render(<CompactSlider {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('1');
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('calls onSelectionChange when slider is moved', () => {
    const onSelectionChange = vi.fn();
    render(<CompactSlider {...defaultProps} onSelectionChange={onSelectionChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2' } });

    expect(onSelectionChange).toHaveBeenCalledWith(2);
  });

  it('calls onInputChange when text input is changed', () => {
    const onInputChange = vi.fn();
    render(<CompactSlider {...defaultProps} onInputChange={onInputChange} />);

    const input = screen.getByDisplayValue('10');
    fireEvent.change(input, { target: { value: '20' } });

    expect(onInputChange).toHaveBeenCalledWith(20);
  });

  it('stops event propagation on click', () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <CompactSlider {...defaultProps} />
      </div>
    );

    fireEvent.click(screen.getByText('Test Label'));
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('stops event propagation on slider change', () => {
    const parentChange = vi.fn();
    render(
      <div onChange={parentChange}>
        <CompactSlider {...defaultProps} />
      </div>
    );

    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
    expect(parentChange).not.toHaveBeenCalled();
  });
});
