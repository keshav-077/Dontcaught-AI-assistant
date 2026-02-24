# Requirements Document

## Introduction

This feature enables the DontCaught application to remain visible above all other windows by default. Since the application is hidden from the taskbar, users need a way to ensure it stays accessible and visible during interviews and meetings. The always-on-top behavior ensures that when other applications are opened (like code editors, browsers, or IDEs), the DontCaught window remains visible and accessible without requiring manual window management.

## Glossary

- **Application**: The DontCaught desktop application built with Tauri
- **Window_Manager**: The Tauri window management system responsible for controlling window properties
- **Always_On_Top_State**: A boolean configuration value that determines whether the window stays above all other windows
- **Main_Window**: The primary application window that displays the DontCaught interface
- **Settings_UI**: The user interface component that displays application settings
- **Z_Order**: The stacking order of windows on the screen, where higher z-order means more visible

## Requirements

### Requirement 1: Default Always-On-Top Behavior

**User Story:** As a user, I want the application to stay on top of all other windows by default, so that I can always see and access it during interviews without manually bringing it to the front.

#### Acceptance Criteria

1. WHEN the application starts for the first time, THE Main_Window SHALL be set to always-on-top mode by default
2. WHEN no saved preference exists, THE Application SHALL use always-on-top enabled as the default setting
3. WHEN the application is in always-on-top mode, THE Main_Window SHALL remain visible above all other application windows
4. WHEN another application window is opened or focused, THE Main_Window SHALL maintain its position in the Z_Order above that window

### Requirement 2: Always-On-Top Toggle Control

**User Story:** As a user, I want to control whether the application stays on top of other windows, so that I can disable this behavior when it's not needed.

#### Acceptance Criteria

1. THE Application SHALL provide a settings option to toggle always-on-top behavior
2. WHEN the user enables always-on-top, THE Window_Manager SHALL set the window's always-on-top property to true
3. WHEN the user disables always-on-top, THE Window_Manager SHALL set the window's always-on-top property to false
4. WHEN the always-on-top setting changes, THE Application SHALL apply the change immediately without requiring a restart

### Requirement 3: Settings Persistence

**User Story:** As a user, I want my always-on-top preference to be remembered, so that I don't have to reconfigure it every time I open the application.

#### Acceptance Criteria

1. WHEN the user changes the always-on-top setting, THE Application SHALL persist the preference to local storage
2. WHEN the application starts, THE Application SHALL load the saved always-on-top preference from local storage
3. WHEN the application starts, THE Window_Manager SHALL apply the saved always-on-top setting before the window becomes visible

### Requirement 4: Settings UI Integration

**User Story:** As a user, I want to easily find and modify the always-on-top setting, so that I can quickly adjust it when needed.

#### Acceptance Criteria

1. THE Settings_UI SHALL display a clearly labeled toggle control for always-on-top behavior
2. THE Settings_UI SHALL show the current state of the always-on-top setting
3. WHEN the user interacts with the toggle control, THE Settings_UI SHALL provide immediate visual feedback
4. THE Settings_UI SHALL include a brief description explaining what the setting does

### Requirement 5: Cross-Platform Compatibility

**User Story:** As a user on any supported platform, I want the always-on-top feature to work correctly, so that I have a consistent experience regardless of my operating system.

#### Acceptance Criteria

1. WHEN running on Windows, THE Application SHALL maintain always-on-top behavior using Windows window management APIs
2. WHEN running on macOS, THE Application SHALL maintain always-on-top behavior using macOS window management APIs
3. WHEN running on Linux, THE Application SHALL maintain always-on-top behavior using Linux window management APIs
4. IF a platform does not support always-on-top, THEN THE Application SHALL gracefully handle the limitation and inform the user

### Requirement 6: Window State Preservation

**User Story:** As a user, I want the application to maintain its other window properties when I change always-on-top behavior, so that my window position and size are not affected.

#### Acceptance Criteria

1. WHEN the always-on-top setting changes, THE Window_Manager SHALL preserve the window's position
2. WHEN the always-on-top setting changes, THE Window_Manager SHALL preserve the window's size
3. WHEN the always-on-top setting changes, THE Window_Manager SHALL preserve all other window properties (transparency, taskbar visibility, etc.)

### Requirement 7: Interaction with Other Window Features

**User Story:** As a user, I want the always-on-top feature to work correctly with other window features like hide-from-taskbar, so that all features work together seamlessly.

#### Acceptance Criteria

1. WHEN both always-on-top and hide-from-taskbar are enabled, THE Application SHALL maintain both behaviors simultaneously
2. WHEN the user changes the always-on-top setting, THE Application SHALL not affect the hide-from-taskbar setting
3. WHEN the user changes the hide-from-taskbar setting, THE Application SHALL not affect the always-on-top setting
