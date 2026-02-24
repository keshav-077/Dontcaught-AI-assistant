# Implementation Plan: Default Cursor Styling

## Overview

This implementation removes custom cursor styling from the application bar by applying CSS overrides to components that have `data-tauri-drag-region` attributes. The changes are minimal and focused on visual presentation only, preserving all existing functionality.

## Tasks

- [x] 1. Apply cursor override to DragButton component
  - Add `cursor-default` Tailwind class to the Button element in DragButton.tsx
  - Ensure the class is applied to both the licensed and unlicensed button variants
  - Verify the cursor override works with the `data-tauri-drag-region` attribute
  - _Requirements: 1.3, 1.4, 2.2, 3.1, 3.2_

- [x] 2. Apply cursor override to Application Bar Card
  - Add `cursor-default` class to the Card component in src/pages/app/index.tsx
  - Ensure the override applies to all child elements within the bar
  - _Requirements: 1.1, 1.2, 3.3_

- [x] 3. Manual verification checkpoint
  - Test cursor appearance by hovering over all bar elements
  - Verify drag functionality still works for licensed users
  - Verify license prompt still appears for unlicensed users
  - Test on Windows platform (primary target)
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.3_

## Notes

- All changes are CSS-only modifications using Tailwind utility classes
- No TypeScript/JavaScript logic changes required
- Window dragging functionality is preserved through Tauri's `data-tauri-drag-region` attribute
- Testing is manual and visual due to the nature of cursor styling
- Changes should be immediately visible without requiring application restart
