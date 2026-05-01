# AuTab0Viewer Compact Refactoring

## Overview
Decomposed a monolithic viewer component into stateful feature components and stateless common components while improving vertical density.

## Patterns
- Stateless components in `src/components/` (e.g., `CompactAccordion`, `ViewerOptionRow`).
- Stateful feature components in `src/feature/` (e.g., `AuTab0OptionRow`, `AuTab0MapCategory`).
- Each component follows the `FunctionName + Props` interface naming convention.
- Vertical space tightened by reducing padding (`p-4` -> `p-2`) and margins.
- Preserved existing `OptionEditorAccordion` by creating a specialized `CompactAccordion`.
