# Design Document: Hide from Taskbar

## Overview

This feature adds a user-configurable toggle to control whether the DontCaught application appears in the system taskbar. The implementation leverages Tauri's window management API to dynamically control the `skipTaskbar` property, with the preference persisted to the application's SQLite database.

The design follows the existing application architecture with React/TypeScript frontend and Rust/Tauri backend, integrating seamlessly with the current settings system.

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
│  - set_skip_taskbar()                   │
│  - get_skip_taskbar()                   │
└──────────────┬──────────────────────────┘
               │
               ├──────────────┬─────────────┐
               ▼              ▼             ▼
         ┌─────────┐    ┌─────────┐   ┌─────────┐
         │ Window  │    │ SQLite  │   │ Config  │
         │   API   │    │   DB    │   │  File   │
         └─────────┘    └─────────┘   └─────────┘
```

## Components and Interfaces

### Frontend Components

#### Settings Toggle Component

Location: `src/components/settings/TaskbarVisibilityToggle.tsx`

```typescript
interface TaskbarVisibilityToggleProps {
  // No props needed - component manages its own state
}

// Component renders a labeled switch control
// Loads initial state from backend on mount
// Calls backend command on toggle
```

#### Settings Integration

The toggle will be added to the existing settings panel, likely in a "Appearance" or "Window" section.

### Backend Commands

#### Tauri Command: `set_skip_taskbar`

```rust
#[tauri::command]
async fn set_skip_taskbar(
    window: tauri::Window,
    skip: bool,
    app_handle: tauri::AppHandle
) -> Result<(), String>
```

**Behavior:**
- Updates the window's `skip_taskbar` property using Tauri's window API
- Persists the preference to the SQLite database
- Returns success/error status

#### Tauri Command: `get_skip_taskbar`

```rust
#[tauri::command]
async fn get_skip_taskbar(app_handle: tauri::AppHandle) -> Result<bool, String>
```

**Behavior:**
- Queries the SQLite database for the saved preference
- Returns the current setting
- Returns default value (true) if no preference exists

### Data Models

#### Database Schema

Add a new settings table entry or use existing settings table:

```sql
-- If using key-value settings table
INSERT INTO settings (key, value) VALUES ('skip_taskbar', 'true');

-- Or add column to existing settings structure
ALTER TABLE app_settings ADD COLUMN skip_taskbar BOOLEAN DEFAULT TRUE;
```

#### Configuration State

```typescript
interface AppSettings {
  // ... existing settings
  skipTaskbar: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Taskbar visibility setting round-trip

*For any* boolean value (true or false), setting the taskbar visibility preference and then retrieving it should return the same value.

**Validates: Requirements 2.1**

### Property 2: Setting application persists across restarts

*For any* boolean value, after setting the taskbar visibility preference, simulating an application restart and loading the preference should return the same value.

**Validates: Requirements 2.2**

### Property 3: Taskbar visibility applies immediately

*For any* boolean value, after calling the set_skip_taskbar command, querying the window's skip taskbar property should immediately reflect the new value without requiring a restart.

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 4: UI reflects backend state

*For any* taskbar visibility setting value, the Settings UI toggle control should display a state that matches the backend setting value.

**Validates: Requirements 4.2**

### Property 5: Window properties preservation

*For any* window state (position, size, transparency, always-on-top, etc.), changing the taskbar visibility setting should preserve all window properties except the skipTaskbar property itself.

**Validates: Requirements 6.1, 6.2, 6.3**

## Error Handling

### Invalid State Handling

- If the database query fails, return the default value (true - hide from taskbar)
- If the window API call fails, log the error and return a descriptive error message to the UI
- If the setting cannot be applied on the current platform, inform the user gracefully

### Platform Compatibility

- Use Tauri's conditional compilation to handle platform-specific behavior
- On platforms that don't support taskbar hiding, disable the toggle and show an informational message
- Ensure the application doesn't crash if the window API is unavailable

### Database Errors

- If database write fails, show error to user but don't prevent the window property from being set
- Implement retry logic for transient database errors
- Log all database errors for debugging

## Testing Strategy

### Unit Tests

Unit tests will focus on specific examples, edge cases, and platform-specific behavior:

- Test that the settings UI renders with the correct initial state
- Test that the default value is "hide from taskbar" (true) when no preference exists
- Test platform-specific behavior on Windows, macOS, and Linux
- Test error handling when database operations fail
- Test error handling when window API calls fail
- Test that the UI includes descriptive text for the setting

### Property-Based Tests

Property-based tests will verify universal properties across all inputs. Each test should run a minimum of 100 iterations.

- **Property 1**: Test round-trip persistence (set → get returns same value)
- **Property 2**: Test persistence across simulated restarts
- **Property 3**: Test immediate application of setting changes
- **Property 4**: Test UI state synchronization with backend
- **Property 5**: Test preservation of other window properties

Each property test must be tagged with:
```
Feature: hide-from-taskbar, Property N: [property description]
```

### Integration Tests

- Test the complete flow: UI toggle → backend command → window update → database persistence
- Test application startup with various saved preferences
- Test switching between hidden and visible states multiple times

### Testing Framework

For Rust backend:
- Use the built-in Rust testing framework
- Consider using `proptest` or `quickcheck` for property-based testing

For TypeScript frontend:
- Use Vitest (already in the project)
- Consider using `fast-check` for property-based testing
- Use React Testing Library for component tests

## Implementation Notes

### Tauri Window API

The implementation will use Tauri's `Window::set_skip_taskbar()` method:

```rust
window.set_skip_taskbar(skip)?;
```

### Database Integration

The application already uses `@tauri-apps/plugin-sql` with SQLite. The implementation should:
- Check if a settings table exists, or use the existing one
- Use parameterized queries to prevent SQL injection
- Handle database migrations if schema changes are needed

### State Synchronization

- The frontend should load the initial state on component mount
- Use React hooks (useState, useEffect) for state management
- Consider using a global state manager if settings grow more complex

### Performance Considerations

- The window property change should be nearly instantaneous
- Database writes should be asynchronous to avoid blocking the UI
- Cache the current setting in memory to avoid repeated database queries
