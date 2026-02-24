# Implementation Plan: Always On Top

## Overview

This implementation adds an always-on-top feature to the DontCaught application, ensuring the main window remains visible above all other windows by default. The implementation follows the same pattern as the existing hide-from-taskbar feature, using Tauri's window management API with React/TypeScript frontend and Rust backend.

## Tasks

- [x] 1. Set up database schema and default settings
  - Add migration to insert default `always_on_top` setting with value `true` in `app_settings` table
  - Ensure the migration follows the same pattern as the `skip_taskbar` setting
  - _Requirements: 1.2, 3.1_

- [x] 2. Implement backend Tauri commands
  - [x] 2.1 Add `get_always_on_top` command in `src-tauri/src/window.rs`
    - Return default value (true) for compatibility
    - Follow the same pattern as `get_skip_taskbar` command
    - _Requirements: 3.2_
  
  - [x] 2.2 Add `set_always_on_top` command in `src-tauri/src/window.rs`
    - Accept window and boolean parameter
    - Call `window.set_always_on_top()` with the provided value
    - Return success/error status
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [ ]* 2.3 Write property test for setting application
    - **Property 3: Setting applies immediately**
    - **Validates: Requirements 2.2, 2.3, 2.4**
  
  - [ ]* 2.4 Write unit tests for backend commands
    - Test error handling when window API fails
    - Test that commands return appropriate success/error messages
    - _Requirements: 2.2, 2.3_

- [x] 3. Integrate always-on-top into window startup
  - [x] 3.1 Modify `setup_main_window` function in `src-tauri/src/window.rs`
    - Add async task to set always-on-top to true by default on startup
    - Follow the same pattern as the skip_taskbar initialization
    - Handle errors gracefully with error logging
    - _Requirements: 1.1, 1.2, 3.3_
  
  - [ ]* 3.2 Write unit test for startup initialization
    - Test that default value (true) is applied on first startup
    - Test error handling when window API is unavailable
    - _Requirements: 1.1, 1.2_

- [x] 4. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement frontend settings UI component
  - [x] 5.1 Create `AlwaysOnTopToggle.tsx` component in `src/components/settings/`
    - Create toggle switch component with label "Always on top"
    - Add descriptive text explaining the feature
    - Load initial state from database on component mount
    - Handle toggle changes by calling backend command and updating database
    - Follow the same pattern as the hide-from-taskbar toggle component
    - _Requirements: 2.1, 4.1, 4.2, 4.4_
  
  - [ ]* 5.2 Write property test for UI state synchronization
    - **Property 4: UI reflects backend state**
    - **Validates: Requirements 4.2**
  
  - [ ]* 5.3 Write unit tests for toggle component
    - Test that component renders with correct initial state
    - Test that toggle includes descriptive text
    - Test that toggle is clearly labeled
    - _Requirements: 4.1, 4.4_

- [x] 6. Integrate toggle into settings panel
  - [x] 6.1 Add AlwaysOnTopToggle component to settings UI
    - Import and render the component in the settings panel
    - Position it near the hide-from-taskbar toggle for consistency
    - Ensure proper styling and layout
    - _Requirements: 2.1, 4.1_

- [x] 7. Implement database persistence in frontend
  - [x] 7.1 Add database query functions for always-on-top setting
    - Create function to load `always_on_top` setting from database
    - Create function to save `always_on_top` setting to database
    - Use tauri-plugin-sql following the same pattern as skip_taskbar
    - _Requirements: 3.1, 3.2_
  
  - [ ]* 7.2 Write property test for persistence round-trip
    - **Property 1: Always-on-top setting round-trip**
    - **Validates: Requirements 3.1**
  
  - [ ]* 7.3 Write property test for persistence across restarts
    - **Property 2: Setting persistence across restarts**
    - **Validates: Requirements 3.2**

- [x] 8. Checkpoint - Ensure frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement feature interaction and independence
  - [x] 9.1 Ensure always-on-top works with hide-from-taskbar
    - Test that both settings can be enabled simultaneously
    - Verify that changing one setting doesn't affect the other
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ]* 9.2 Write property test for feature independence
    - **Property 6: Feature independence**
    - **Validates: Requirements 7.2, 7.3**
  
  - [ ]* 9.3 Write property test for simultaneous operation
    - **Property 7: Simultaneous feature operation**
    - **Validates: Requirements 7.1**

- [x] 10. Implement window properties preservation
  - [x] 10.1 Verify that changing always-on-top preserves other window properties
    - Ensure window position is preserved when toggling always-on-top
    - Ensure window size is preserved when toggling always-on-top
    - Ensure other properties (transparency, taskbar visibility) are preserved
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 10.2 Write property test for window properties preservation
    - **Property 5: Window properties preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 11. Add platform-specific handling and error cases
  - [x] 11.1 Add error handling for unsupported platforms
    - Detect if platform doesn't support always-on-top
    - Show informational message to user if feature is unavailable
    - Disable toggle on unsupported platforms
    - _Requirements: 5.4_
  
  - [ ]* 11.2 Write unit tests for platform-specific behavior
    - Test Windows platform behavior
    - Test macOS platform behavior
    - Test Linux platform behavior
    - Test error handling for unsupported platforms
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 12. Final checkpoint - Integration testing
  - [x] 12.1 Test complete user flow
    - Test toggling always-on-top on and off multiple times
    - Test that setting persists across application restarts
    - Test that always-on-top works with hide-from-taskbar
    - Test that window stays on top when other applications are opened
    - _Requirements: 1.3, 1.4, 2.4, 3.2, 7.1_
  
  - [ ]* 12.2 Write integration tests
    - Test complete flow: UI toggle → backend command → window update → database persistence
    - Test application startup with various saved preferences
    - Test interaction with hide-from-taskbar feature
    - _Requirements: 1.1, 2.4, 3.2, 7.1_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows the same pattern as the hide-from-taskbar feature for consistency
- Property tests should run a minimum of 100 iterations
- Checkpoints ensure incremental validation
- Platform-specific testing should be done on Windows, macOS, and Linux
