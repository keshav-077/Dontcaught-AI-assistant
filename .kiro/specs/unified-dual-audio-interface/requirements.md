# Requirements Document

## Introduction

This document specifies the requirements for a unified dual-audio capture interface that consolidates microphone and system audio capture into a single, streamlined interface. The feature enables simultaneous capture and real-time transcription of both audio sources (interviewer/system audio and user microphone), with integrated keyboard shortcuts for efficient workflow. The interface design is inspired by Cluely's clean, dual-pane approach to audio capture.

## Glossary

- **System_Audio_Capture**: The process of capturing audio output from the system (speakers/headphones) - what the user is listening to
- **Microphone_Capture**: The process of capturing audio input from the user's microphone - what the user is saying
- **Dual_Audio_Interface**: A unified interface that displays both System_Audio_Capture and Microphone_Capture simultaneously
- **Real_Time_Transcription**: The process of converting audio to text as it is being captured, with minimal delay
- **Audio_Source**: Either the system audio output device or the microphone input device
- **Transcription_Pane**: A visual section of the interface that displays transcribed text for one Audio_Source
- **Audio_Visualization**: A visual representation of audio levels or waveforms for an Audio_Source
- **LLM_Processing**: The process of sending transcribed text to a Large Language Model for analysis or response generation
- **Keyboard_Shortcut**: A key combination that triggers a specific action (e.g., Ctrl+Enter)
- **Audio_Device_Selection**: The interface component that allows users to choose which physical devices to use for audio capture

## Requirements

### Requirement 1: Unified Dual-Audio Interface Display

**User Story:** As a user, I want to see both my microphone and system audio in a single unified interface, so that I can monitor both audio sources simultaneously without switching between separate views.

#### Acceptance Criteria

1. WHEN the Dual_Audio_Interface is opened, THE System SHALL display both Audio_Source sections side-by-side in a single window
2. THE System SHALL clearly label the left section as "Interviewer/System Audio" and the right section as "User Microphone"
3. THE System SHALL provide visual separation between the two Transcription_Pane sections using borders or spacing
4. WHEN either Audio_Source is active, THE System SHALL display Audio_Visualization for that source
5. THE System SHALL display status indicators showing whether each Audio_Source is actively capturing

### Requirement 2: Simultaneous Audio Capture

**User Story:** As a user, I want to capture audio from both my microphone and system audio at the same time, so that I can record complete conversations including both sides.

#### Acceptance Criteria

1. WHEN the user starts capture, THE System SHALL initiate both System_Audio_Capture and Microphone_Capture simultaneously
2. WHEN the user stops capture, THE System SHALL stop both System_Audio_Capture and Microphone_Capture simultaneously
3. THE System SHALL maintain independent audio streams for each Audio_Source during capture
4. IF one Audio_Source fails to initialize, THEN THE System SHALL display an error for that specific source while allowing the other to continue
5. THE System SHALL persist the selected audio devices across application restarts

### Requirement 3: Real-Time Dual Transcription

**User Story:** As a user, I want to see live transcriptions for both audio sources in real-time, so that I can verify what is being captured and ensure accuracy.

#### Acceptance Criteria

1. WHEN System_Audio_Capture is active, THE System SHALL display Real_Time_Transcription in the left Transcription_Pane
2. WHEN Microphone_Capture is active, THE System SHALL display Real_Time_Transcription in the right Transcription_Pane
3. THE System SHALL update each Transcription_Pane independently as new audio is transcribed
4. THE System SHALL visually distinguish transcription text between the two sources using labels or formatting
5. WHEN transcription is complete, THE System SHALL preserve the final transcribed text in both panes

### Requirement 4: Keyboard Shortcut Integration

**User Story:** As a user, I want to use Ctrl+Enter to quickly process transcribed text and navigate to the response, so that I can maintain an efficient workflow without using the mouse.

#### Acceptance Criteria

1. WHEN the user presses Ctrl+Enter while the Dual_Audio_Interface is active, THE System SHALL trigger LLM_Processing
2. WHEN LLM_Processing is triggered, THE System SHALL send both transcriptions as context to the LLM
3. WHEN LLM_Processing is triggered, THE System SHALL navigate to the LLM response page
4. THE System SHALL include metadata indicating which text came from System_Audio_Capture and which came from Microphone_Capture
5. IF no transcription text exists in either pane, THEN THE System SHALL prevent LLM_Processing and display a notification

### Requirement 5: Audio Device Selection Integration

**User Story:** As a user, I want to select which microphone and system audio devices to use, so that I can configure the interface for my specific hardware setup.

#### Acceptance Criteria

1. THE System SHALL provide access to Audio_Device_Selection for both input and output devices
2. WHEN a user changes the microphone device, THE System SHALL update Microphone_Capture to use the new device
3. WHEN a user changes the system audio device, THE System SHALL update System_Audio_Capture to use the new device
4. THE System SHALL display the currently selected device names in the Dual_Audio_Interface
5. THE System SHALL allow device changes without requiring a restart of the audio capture

### Requirement 6: Visual Design and User Experience

**User Story:** As a user, I want a clean and minimal interface similar to Cluely, so that I can focus on the audio capture without visual distractions.

#### Acceptance Criteria

1. THE System SHALL use a two-column layout with equal width for both Transcription_Pane sections
2. THE System SHALL display Audio_Visualization for each Audio_Source using waveforms or level meters
3. THE System SHALL use distinct colors or icons to differentiate between System_Audio_Capture and Microphone_Capture
4. THE System SHALL provide clear visual feedback when audio is being captured (e.g., pulsing indicators, animated waveforms)
5. THE System SHALL maintain consistent spacing and typography throughout the interface

### Requirement 7: Error Handling and Status Communication

**User Story:** As a user, I want clear feedback when something goes wrong with audio capture, so that I can troubleshoot and resolve issues quickly.

#### Acceptance Criteria

1. WHEN an Audio_Source fails to initialize, THE System SHALL display an error message specific to that source
2. WHEN audio device permissions are missing, THE System SHALL display instructions for granting permissions
3. WHEN transcription fails for an Audio_Source, THE System SHALL display an error in the corresponding Transcription_Pane
4. THE System SHALL provide status indicators showing the current state of each Audio_Source (idle, capturing, processing, error)
5. WHEN the user hovers over a status indicator, THE System SHALL display a tooltip with detailed status information

### Requirement 8: Integration with Existing Features

**User Story:** As a developer, I want the unified interface to integrate seamlessly with existing audio capture functionality, so that users can transition smoothly without losing existing capabilities.

#### Acceptance Criteria

1. THE System SHALL maintain compatibility with the existing Audio_Device_Selection component
2. THE System SHALL use the existing Tauri backend commands for audio capture (get_input_devices, get_output_devices)
3. THE System SHALL preserve existing keyboard shortcuts that do not conflict with Ctrl+Enter
4. THE System SHALL maintain the existing audio device persistence mechanism using localStorage
5. WHEN the unified interface is active, THE System SHALL disable or hide the separate microphone and system audio buttons

### Requirement 9: Performance and Responsiveness

**User Story:** As a user, I want the interface to respond quickly to my actions, so that I can work efficiently without delays.

#### Acceptance Criteria

1. WHEN the user starts capture, THE System SHALL begin displaying Audio_Visualization within 500ms
2. WHEN audio is being transcribed, THE System SHALL update the Transcription_Pane within 1 second of speech completion
3. THE System SHALL process the Ctrl+Enter keyboard shortcut within 200ms
4. THE System SHALL handle simultaneous audio streams without audio dropouts or stuttering
5. WHEN switching audio devices, THE System SHALL apply the change within 2 seconds
