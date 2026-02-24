# Design Document: Default Cursor Styling

## Overview

This design addresses the cursor styling issue in the application bar where the `data-tauri-drag-region` attribute causes the cursor to change to a move/grab style. The solution involves applying CSS overrides to force the default cursor while preserving the window dragging functionality provided by Tauri.

The implementation will be minimal and focused: add CSS cursor overrides to the affected components without modifying the underlying drag functionality.

## Architecture

The solution operates at the presentation layer only:

1. **CSS Layer**: Apply `cursor: default !important` styles to override Tauri's default drag region cursor behavior
2. **Component Layer**: Target specific components (Card, DragButton) that contain `data-tauri-drag-region` attributes
3. **Preservation Layer**: Maintain all existing functionality - only visual cursor appearance changes

## Components and Interfaces

### Affected Components

1. **Card Component** (`src/components/ui/card.tsx`)
   - The main Application_Bar uses the Card component
   - Currently has no cursor styling
   - Needs cursor override applied via className

2. **DragButton Component** (`src/components/DragButton.tsx`)
   - Contains `data-tauri-drag-region={hasActiveLicense}` attribute
   - This attribute triggers Tauri's default move cursor
   - Needs explicit cursor override

3. **App Page Component** (`src/pages/app/index.tsx`)
   - Renders the Card containing all bar elements
   - May need cursor styling on the Card wrapper

### CSS Override Strategy

Apply cursor overrides using Tailwind CSS utility classes:
- `cursor-default` - Forces default cursor
- Applied with high specificity to override Tauri defaults
- No `!important` needed if applied directly to elements

## Data Models

No data model changes required. This is purely a styling modification.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Default Cursor Consistency

*For any* element within the Application_Bar, hovering should display the default cursor regardless of underlying attributes.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Drag Functionality Preservation

*For any* licensed user interaction with the DragButton, the window dragging functionality should work identically before and after cursor styling changes.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: CSS Override Effectiveness

*For any* element with `data-tauri-drag-region` attribute and cursor override styling, the visual cursor should be the default cursor.

**Validates: Requirements 3.1, 3.2, 3.3**

## Error Handling

No error handling required - this is a pure CSS styling change with no failure modes.

## Testing Strategy

### Unit Tests

Given the visual nature of cursor styling, traditional unit tests are not applicable. Testing will be manual and visual.

### Manual Testing Checklist

1. **Visual Verification**:
   - Hover over the application bar - cursor should remain default
   - Hover over input field - cursor should remain default
   - Hover over buttons - cursor should remain default
   - Hover over drag button - cursor should remain default

2. **Functionality Verification**:
   - With active license: drag button should still enable window dragging
   - Without active license: drag button should show license prompt
   - All existing interactions should work unchanged

3. **Cross-Platform Testing**:
   - Test on Windows (primary platform based on context)
   - Test on macOS if available
   - Test on Linux if available

### Property-Based Testing

Property-based testing is not applicable for CSS cursor styling as:
- Cursor appearance is a visual property not accessible to automated tests
- No computational properties to verify
- Manual visual inspection is the appropriate testing method
