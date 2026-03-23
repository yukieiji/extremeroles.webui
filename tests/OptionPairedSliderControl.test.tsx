import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OptionPairedSliderControl } from '../src/components/parts/OptionPairedSliderControl';

describe('OptionPairedSliderControl', () => {
  const minValues = [0, 5, 10, 15, 20];
  const maxValues = [0, 5, 10, 15, 20];
  const format = '{0}s';

  const onMinChange = vi.fn();
  const onMaxChange = vi.fn();

  it('renders both sliders and labels', () => {
    render(
      <OptionPairedSliderControl
        minSelection={1}
        maxSelection={3}
        minValues={minValues}
        maxValues={maxValues}
        format={format}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
        minLabel="最小"
        maxLabel="最大"
      />
    );

    expect(screen.getByText('最小')).toBeInTheDocument();
    expect(screen.getByText('最大')).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(2);
    // Values are displayed in inputs
    expect(screen.getByDisplayValue('5')).toBeInTheDocument(); // Min value at index 1
    expect(screen.getByDisplayValue('15')).toBeInTheDocument(); // Max value at index 3
  });

  it('syncs max when min exceeds it', () => {
    render(
      <OptionPairedSliderControl
        minSelection={1}
        maxSelection={3}
        minValues={minValues}
        maxValues={maxValues}
        format={format}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
        minLabel="Min"
        maxLabel="Max"
      />
    );

    const minSlider = screen.getAllByRole('slider')[0];
    // Move min to index 4 (value 20), which is greater than max (index 3, value 15)
    fireEvent.change(minSlider, { target: { value: '4' } });

    expect(onMinChange).toHaveBeenCalledWith(4);
    expect(onMaxChange).toHaveBeenCalledWith(4);
  });

  it('syncs min when max is less than it', () => {
    render(
      <OptionPairedSliderControl
        minSelection={1}
        maxSelection={3}
        minValues={minValues}
        maxValues={maxValues}
        format={format}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
        minLabel="Min"
        maxLabel="Max"
      />
    );

    const maxSlider = screen.getAllByRole('slider')[1];
    // Move max to index 0 (value 0), which is less than min (index 1, value 5)
    fireEvent.change(maxSlider, { target: { value: '0' } });

    expect(onMaxChange).toHaveBeenCalledWith(0);
    expect(onMinChange).toHaveBeenCalledWith(0);
  });
});
