import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExRHeaderOptionControl } from '../src/feature/ExRHeaderOptionControl';
import { useStore } from '../src/useStore';
import type { ExROptionDto } from '../src/type';

describe('ExRHeaderOptionControl', () => {
  const mockOption: ExROptionDto = {
    Id: 50,
    IsActive: true,
    TranslatedName: 'レート',
    Selection: 0,
    Format: '{0}%',
    RangeMeta: { Type: 'Int32', Values: [0, 50, 100] },
    Childs: [],
  };

  beforeEach(() => {
    useStore.getState().resetViewer();
  });

  it('renders correctly with given label and value', () => {
    render(
      <ExRHeaderOptionControl
        categoryId={1}
        option={mockOption}
        label="Rate"
      />
    );

    expect(screen.getByText('Rate')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('0');

    const inputs = screen.getAllByDisplayValue('0');
    const textInput = inputs.find(i => (i as HTMLInputElement).type === 'text');
    expect(textInput).toBeInTheDocument();
  });

  it('updates selection when slider is moved', () => {
    render(
      <ExRHeaderOptionControl
        categoryId={1}
        option={mockOption}
        label="Rate"
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '1' } });

    // Check if store was updated
    const state = useStore.getState();
    expect(state.effectiveSelections['1-50']).toBe(1);
  });

  it('updates selection when input is changed', () => {
    render(
      <ExRHeaderOptionControl
        categoryId={1}
        option={mockOption}
        label="Rate"
      />
    );

    const inputs = screen.getAllByDisplayValue('0');
    const textInput = inputs.find(i => (i as HTMLInputElement).type === 'text')!;

    fireEvent.change(textInput, { target: { value: '100' } });

    const state = useStore.getState();
    expect(state.effectiveSelections['1-50']).toBe(2); // 100 is at index 2
  });

  it('prevents click propagation to parent', () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <ExRHeaderOptionControl
          categoryId={1}
          option={mockOption}
          label="Rate"
        />
      </div>
    );

    const label = screen.getByText('Rate');
    fireEvent.click(label);

    expect(parentClick).not.toHaveBeenCalled();
  });
});
