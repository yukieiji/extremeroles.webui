# Handling 'erasableSyntaxOnly' in TypeScript

## What is it?
A TypeScript setting (often in `tsconfig.json`) that restricts the use of syntax that cannot be simply "erased" to become valid JavaScript. This ensures compatibility with some build tools or specific runtime environments.

## Restrictions
- **Enums are prohibited**: You cannot use `enum Name { ... }`.
- **Reason**: Enums generate code (objects and mapping) that cannot be simply removed by stripping types.

## Alternatives
Use a `const` object with `as const` and a type alias:

```typescript
export const OptionTab = {
  GeneralTab: 0,
  CrewmateTab: 1,
  // ...
} as const;

export type OptionTab = (typeof OptionTab)[keyof typeof OptionTab];
```

This code remains valid JavaScript once the `type` alias is removed.
