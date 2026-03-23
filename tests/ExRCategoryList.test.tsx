import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExRCategoryList } from '../src/feature/ExRCategoryList';
import { OptionTab, type ExRTabDto } from '../src/type';
import { useStore } from '../src/useStore';

describe('ExRCategoryList Component Selection', () => {
  const mockTabs: ExRTabDto[] = [
    {
      Id: OptionTab.GeneralTab, // Tab 0
      Name: 'General',
      Categories: [
        {
          Id: 1,
          Name: 'General Category',
          Options: [
            {
              Id: 101,
              IsActive: true,
              TranslatedName: 'General Option',
              Selection: 0,
              Format: '{0}',
              RangeMeta: { Type: 'Int32', Values: [0, 1] },
              Childs: [],
            },
          ],
        },
      ],
    },
    {
      Id: OptionTab.CrewmateTab, // Tab 1
      Name: 'Crewmate',
      Categories: [
        {
          Id: 2,
          Name: 'Sheriff',
          Options: [
            {
              Id: 50,
              IsActive: true,
              TranslatedName: 'Spawn Rate',
              Selection: 0,
              Format: '{0}',
              RangeMeta: { Type: 'Int32', Values: [0, 100] },
              Childs: [],
            },
            {
              Id: 51,
              IsActive: true,
              TranslatedName: 'Spawn Count',
              Selection: 0,
              Format: '{0}',
              RangeMeta: { Type: 'Int32', Values: [0, 1] },
              Childs: [],
            },
            {
              Id: 201,
              IsActive: true,
              TranslatedName: 'Kill CD',
              Selection: 0,
              Format: '{0}',
              RangeMeta: { Type: 'Int32', Values: [10, 20] },
              Childs: [],
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    useStore.getState().resetViewer();
  });

  it('renders ExRStandardCategoryItem for General Tab', () => {
    useStore.getState().setSelectedExRTabId(OptionTab.GeneralTab);
    render(<ExRCategoryList tabs={mockTabs} />);

    // General Tab: Should render standard category
    expect(screen.getByText('General Category')).toBeInTheDocument();

    // Header should NOT have spawn controls
    expect(screen.queryByText('レート')).not.toBeInTheDocument();
  });

  it('renders ExRRoleCategoryItem for Role Tab', () => {
    useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
    render(<ExRCategoryList tabs={mockTabs} />);

    // Role Tab: Should render specialized category item
    expect(screen.getByText('Sheriff')).toBeInTheDocument();

    // Header should have spawn rate control (レート)
    expect(screen.getByText('レート')).toBeInTheDocument();
  });

  it('filters out 50 and 51 from role category body', () => {
    useStore.getState().setSelectedExRTabId(OptionTab.CrewmateTab);
    render(<ExRCategoryList tabs={mockTabs} />);

    // Open accordion - RoleCategoryItem uses a custom layout,
    // we find the toggle button by role.
    const toggleButton = screen.getByRole('button', { name: /Sheriff/i });
    fireEvent.click(toggleButton);

    // Body content should be visible after click
    // ExRRoleCategoryItem renders options list when isOpen is true
    expect(screen.getByText('Kill CD')).toBeInTheDocument();

    // 50 and 51 should be filtered out from the body
    expect(screen.queryByText('Spawn Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Spawn Count')).not.toBeInTheDocument();
  });
});
