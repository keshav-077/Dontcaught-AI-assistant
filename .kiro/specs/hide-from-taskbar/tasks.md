# Implementation Plan: Hide from Taskbar

## Overview

This implementation adds a user-configurable toggle to control taskbar visibility. The feature integrates with the existing Tauri backend (Rust) and React frontend (TypeScript), using the application's SQLite database for persistence.

## Tasks

- [x] 1. Set up database schema for taskbar visibility preference
  - Add a settings entry for `skip_taskbar` in the SQLite database
  - Create or modify the settings table to store the boolean preference
  - Set default value to `true` (hide from taskbar)
  - _Requirements: 2.1, 3.1, 3.2_

- [x] 2. Implement backend Tauri commands
  - [x] 2.1 Implement `get_skip_taskbar` command
    - Query the database for the saved preference
    - Return default value (true) if no preference exists
    - Handle database errors gracefully
    - _Requirements: 2.2, 3.2_
  
  - [ ]* 2.2 Write property test for get_skip_taskbar
    - **Property 1: Taskbar visibility setting round-trip**
    - **Validates: Requirements 2.1**
  
  - [x] 2.3 Implement `set_skip_taskbar` command
    - Accept boolean parameter for skip taskbar setting
    - Update window's skip_taskbar property using Tauri Window API
    - Persist the preference to SQLite database
    - Return success/error status
    - _Requirements: 1.2, 1.3, 1.4, 2.1_
  
  - [ ]* 2.4 Write property test for set_skip_taskbar immediate application
    - **Property 3: Taskbar visibility applies immediately**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  
  - [ ]* 2.5 Write property test for persistence across restarts
    - **Property 2: Setting application persists across restarts**
    - **Validates: Requirements 2.2**
  
  - [ ]* 2.6 Write unit tests for error handling
    - Test database failure scenarios
    - Test window API failure scenarios
    - Test default value behavior
    - _Requirements: 2.2, 3.2_

- [x] 3. Register Tauri commands in main.rs
  - Add `get_skip_taskbar` and `set_skip_taskbar` to the Tauri command list
  - Ensure commands are accessible from the frontend
  - _Requirements: 1.1_

- [x] 4. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement frontend Settings UI component
  - [x] 5.1 Create TaskbarVisibilityToggle component
    - Create React component with toggle switch control
    - Add clear label: "Hide from taskbar"
    - Add descriptive text explaining the feature
    - Use existing UI component library (Radix UI Switch)
    - _Requirements: 1.1, 4.1, 4.4_
  
  - [x] 5.2 Implement state management in component
    - Load initial state from backend on component mount using `get_skip_taskbar`
    - Handle toggle interactions and call `set_skip_taskbar` command
    - Update local state to reflect changes
    - Handle loading and error states
    - _Requirements: 1.2, 1.3, 4.2_
  
  - [ ]* 5.3 Write property test for UI state synchronization
    - **Property 4: UI reflects backend state**
    - **Validates: Requirements 4.2**
  
  - [ ]* 5.4 Write unit tests for UI component
    - Test component renders with correct initial state
    - Test toggle interaction triggers backend command
    - Test error state display
    - Test loading state display
    - _Requirements: 4.1, 4.2, 4.4_

- [x] 6. Integrate toggle into Settings panel
  - Add TaskbarVisibilityToggle component to the existing settings UI
  - Place in appropriate section (Appearance or Window settings)
  - Ensure consistent styling with other settings controls
  - _Requirements: 1.1, 4.1_

- [x] 7. Implement application startup logic
  - [x] 7.1 Load saved preference on application startup
    - Call `get_skip_taskbar` during app initialization
    - Apply the setting to the main window before it becomes visible
    - Handle errors by falling back to default (true)
    - _Requirements: 2.2, 2.3, 3.1, 3.2_
  
  - [ ]* 7.2 Write unit tests for startup behavior
    - Test first launch with no saved preference (should default to true)
    - Test startup with saved preference (should load saved value)
    - Test startup with database error (should fall back to default)
    - _Requirements: 2.2, 2.3, 3.1, 3.2_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 9. Write property test for window properties preservation
  - **Property 5: Window properties preservation**
  - **Validates: Requirements 6.1, 6.2, 6.3**
  - Test that changing taskbar visibility doesn't affect position, size, transparency, etc.

- [ ]* 10. Write integration tests
  - Test complete flow: UI toggle → backend command → window update → database persistence
  - Test switching between hidden and visible states multiple times
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2_

- [x] 11. Final checkpoint - Verify end-to-end functionality
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The application already has `skipTaskbar: true` in tauri.conf.json - this will become the default value
- Backend uses Rust with Tauri framework
- Frontend uses TypeScript with React and Radix UI components
- Database is SQLite accessed via @tauri-apps/plugin-sql
- Property tests should run minimum 100 iterations
- Each property test must be tagged with: `Feature: hide-from-taskbar, Property N: [description]`
