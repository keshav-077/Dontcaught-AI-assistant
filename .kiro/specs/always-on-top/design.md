# Design Document: Always On Top

## Overview

This feature adds an always-on-top capability to the DontCaught application, ensuring the main window remains visible above all other windows by default. The implementation leverages Tauri's window management API to control the window's z-order, with the preference persisted to the application's SQLite database.

The design follows the existing application architecture with React/TypeScript frontend and Rust/Tauri backend, integrating seamlessly with the current settings system and the existing hide-from-taskbar feature.

## Architecture

The feature consists of three main layers:

1. **Frontend Settings UI**: React component with a toggle switch in the settings panel
2. **State Management**: Local state synchronized with backend storage
3. **Backend Window Control**: Tauri command to modify window properties at runtime

```
┌─────────────────────────────────────────┐
│         Settings UI Component           │
│  (React Toggle + State Management)      │
└──────────────┬──────────────────────────┘
               │
               │ Tauri invoke()
               ▼
┌─────────────────────────────────────────┐
│      Tauri Backend Commands             │
│  - set_always_on_top()                  │
│  - get_always_on_top()                  │
└──────────────┬──────────────────────────┘
               │
               ├──────────────┬─────────────┐
               ▼              ▼             ▼
         ┌─────────┐    ┌─────────┐   ┌─────────┐
         │ Window  │    │ SQLite  │   │ Startup │
         │   API   │    │   DB    │   │  Init   │
         └─────────┘    └─────────┘   └─────────┘
```

## Components and Interfaces

### Frontend Components

#### Settings Toggle Component

Location: `src/components/settings/AlwaysOnTopToggle.tsx`

```typescript
interface AlwaysOnTopToggleProps {
  // No props needed - component manages its own state
}

// Component renders a labeled switch control
// Loads initial state from backend on mount
// Calls backend command on toggle
```

The toggle will be added to the existing settings panel alongside the hide-from-taskbar toggle.

### Backend Commands

#### Tauri Command: `set_always_on_top`

```rust
#[tauri::command]
pub fn set_always_on_top(
    window: tauri::WebviewWindow,
    always_on_top: bool,
) -> Result<(), String>
```

**Behavior:**
- Updates the window's `always_on_top` property using Tauri's window API
- The frontend handles database persistence using tauri-plugin-sql
- Returns success/error status

#### Tauri Command: `get_always_on_top`

```rust
#[tauri::command]
pub fn get_always_on_top() -> Result<bool, String>
```

**Behavior:**
- Returns the default value (true) for compatibility
- Actual database operations are handled by the frontend using tauri-plugin-sql
- This command exists for compatibility and returns the default value

### Window Initialization

#### Startup Integration

Location: `src-tauri/src/window.rs` - `setup_main_window` function

```rust
pub fn setup_main_window(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let window = /* ... get window ... */;
    
    position_window_top_center(&window, TOP_OFFSET)?;
    
    // Load and apply saved always-on-top preference
    let window_clone = window.clone();
    tauri::async_runtime::spawn(async move {
        // Default to true (always on top) on startup
        // The frontend will load the actual saved preference and update if needed
        if let Err(e) = window_clone.set_always_on_top(true) {
            eprintln!("Failed to apply default always_on_top setting on startup: {}", e);
        }
    });
    
    // Existing skip_taskbar initialization...
    
    Ok(())
}
```

### Data Models

#### Database Schema

Add a new entry to the existing `app_settings` table:

```sql
-- Insert default value for always_on_top (true = stay on top)
INSERT OR IGNORE INTO app_settings (key, value) VALUES ('always_on_top', 'true');
```

#### Configuration State

```typescript
interface AppSettings {
  skipTaskbar: boolean;
  alwaysOnTop: boolean;
  // ... other settings
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Always-on-top setting round-trip

*For any* boolean value (true or false), setting the always-on-top preference and then retrieving it should return the same value.

**Validates: Requirements 3.1**

### Property 2: Setting persistence across restarts

*For any* boolean value, after setting the always-on-top preference, simulating an application restart and loading the preference should return the same value.

**Validates: Requirements 3.2**

### Property 3: Setting applies immediately

*For any* boolean value, after calling the set_always_on_top command with that value, the window's always-on-top property should immediately reflect the new value without requiring a restart.

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 4: UI reflects backend state

*For any* always-on-top setting value, the Settings UI toggle control should display a state that matches the backend setting value.

**Validates: Requirements 4.2**

### Property 5: Window properties preservation

*For any* window state (position, size, transparency, taskbar visibility, etc.), changing the always-on-top setting should preserve all window properties except the always-on-top property itself.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 6: Feature independence

*For any* combination of always-on-top and hide-from-taskbar settings, changing one setting should not affect the other setting's value.

**Validates: Requirements 7.2, 7.3**

### Property 7: Simultaneous feature operation

*For any* combination of always-on-top and hide-from-taskbar boolean values, both settings should be applied correctly and maintained simultaneously.

**Validates: Requirements 7.1**

## Error Handling

### Invalid State Handling

- If the database query fails, return the default value (true - always on top)
- If the window API call fails, log the error and return a descriptive error message to the UI
- If the setting cannot be applied on the current platform, inform the user gracefully

### Platform Compatibility

- Use Tauri's conditional compilation to handle platform-specific behavior
- On platforms that don't support always-on-top, disable the toggle and show an informational message
- Ensure the application doesn't crash if the window API is unavailable
- Test on Windows, macOS, and Linux to ensure consistent behavior

### Database Errors

- If database write fails, show error to user but don't prevent the window property from being set
- Implement retry logic for transient database errors
- Log all database errors for debugging

### Interaction with Other Features

- Ensure always-on-top works correctly with hide-from-taskbar feature
- Ensure always-on-top doesn't interfere with window positioning or resizing
- Handle cases where multiple window properties are changed simultaneously

## Testing Strategy

### Unit Tests

Unit tests will focus on specific examples, edge cases, and platform-specific behavior:

- Test that the settings UI renders with the correct initial state
- Test that the default value is "always on top" (true) when no preference exists
- Test platform-specific behavior on Windows, macOS, and Linux
- Test error handling when database operations fail
- Test error handling when window API calls fail
- Test that the UI includes descriptive text for the setting
- Test that the settings toggle is clearly labeled
- Test first-time startup behavior

### Property-Based Tests

Property-based tests will verify universal properties across all inputs. Each test should run a minimum of 100 iterations using a property-based testing library (e.g., `proptest` for Rust, `fast-check` for TypeScript).

Each property test must be tagged with:
```
Feature: always-on-top, Property N: [property description]
```

- **Property 1**: Test round-trip persistence (set → get returns same value)
- **Property 2**: Test persistence across simulated restarts
- **Property 3**: Test immediate application of setting changes
- **Property 4**: Test UI state synchronization with backend
- **Property 5**: Test preservation of other window properties when changing always-on-top
- **Property 6**: Test independence of always-on-top and hide-from-taskbar settings
- **Property 7**: Test simultaneous operation of always-on-top and hide-from-taskbar

### Integration Tests

- Test the complete flow: UI toggle → backend command → window update → database persistence
- Test application startup with various saved preferences
- Test switching between enabled and disabled states multiple times
- Test interaction with hide-from-taskbar feature
- Test that always-on-top works correctly when other applications are opened

### Testing Framework

For Rust backend:
- Use the built-in Rust testing framework
- Consider using `proptest` for property-based testing

For TypeScript frontend:
- Use Vitest (already in the project)
- Consider using `fast-check` for property-based testing
- Use React Testing Library for component tests

## Implementation Notes

### Tauri Window API

The implementation will use Tauri's `Window::set_always_on_top()` method:

```rust
window.set_always_on_top(always_on_top)?;
```

### Database Integration

The application already uses `@tauri-apps/plugin-sql` with SQLite. The implementation should:
- Use the existing `app_settings` table with key-value pairs
- Add a new row with key `always_on_top` and default value `true`
- Use parameterized queries to prevent SQL injection
- Follow the same pattern as the hide-from-taskbar feature

### State Synchronization

- The frontend should load the initial state on component mount
- Use React hooks (useState, useEffect) for state management
- Follow the same pattern as the hide-from-taskbar toggle component
- Ensure the setting is loaded and applied before the window becomes visible

### Startup Initialization

- Add always-on-top initialization to the `setup_main_window` function
- Apply the default value (true) immediately on startup
- Let the frontend load the saved preference and update if needed
- Use async runtime to avoid blocking the startup process

### Performance Considerations

- The window property change should be nearly instantaneous
- Database writes should be asynchronous to avoid blocking the UI
- Cache the current setting in memory to avoid repeated database queries
- Follow the same performance patterns as the hide-from-taskbar feature

### Code Organization

- Add new Tauri commands to `src-tauri/src/window.rs`
- Create new React component in `src/components/settings/`
- Add database migration for the new setting
- Update the settings UI to include the new toggle
- Ensure consistent naming and code style with existing features
