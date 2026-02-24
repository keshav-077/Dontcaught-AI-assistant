# Implementation Plan: Unified Dual-Audio Interface

## Overview

This implementation plan breaks down the unified dual-audio interface feature into discrete, incremental coding tasks. The approach follows a bottom-up strategy: starting with backend infrastructure, then building core hooks, followed by UI components, and finally integration and testing. Each task builds on previous work to ensure continuous validation and early error detection.

## Tasks

- [x] 1. Set up Tauri backend infrastructure for microphone capture
  - Create new Rust module for microphone audio capture with VAD support
  - Implement `start_microphone_capture` command that mirrors `start_system_audio_capture`
  - Implement `stop_microphone_capture` command
  - Implement `get_audio_levels` command to return real-time audio levels for both sources
  - Add event emitters for `microphone-speech-detected` and `audio-levels-update`
  - _Requirements: 2.1, 2.2, 2.3, 9.1_

- [ ]* 1.1 Write property test for microphone capture backend
  - **Property 2: Independent Audio Stream Isolation**
  - **Validates: Requirements 2.3**

- [-] 2. Create useMicrophone hook
  - [x] 2.1 Implement core useMicrophone hook structure
    - Create hook file with state management (isCapturing, audioLevel, transcription, status, error)
    - Implement startCapture and stopCapture functions using Tauri commands
    - Add event listeners for microphone-speech-detected events
    - Implement transcription processing using existing STT provider integration
    - Add audio level monitoring
    - _Requirements: 2.1, 2.2, 3.2, 9.1_
  
  - [ ]* 2.2 Write property test for useMicrophone hook
    - **Property 7: Transcription Preservation**
    - **Validates: Requirements 3.5**
  
  - [ ]* 2.3 Write unit tests for useMicrophone hook
    - Test capture start/stop state transitions
    - Test error handling for device failures
    - Test transcription event processing
    - _Requirements: 2.1, 2.2, 7.1_

- [x] 3. Create useDualAudio hook
  - [x] 3.1 Implement useDualAudio hook composition
    - Compose useSystemAudio and useMicrophone hooks
    - Implement synchronized startCapture that starts both sources
    - Implement synchronized stopCapture that stops both sources
    - Add state management for dual audio interface (isOpen, overall capturing state)
    - Implement device selection functions for both sources
    - _Requirements: 2.1, 2.2, 5.2, 5.3_
  
  - [ ]* 3.2 Write property test for synchronized operations
    - **Property 1: Synchronized Capture Operations**
    - **Validates: Requirements 2.1, 2.2**
  
  - [ ]* 3.3 Write property test for graceful partial failure
    - **Property 3: Graceful Partial Failure**
    - **Validates: Requirements 2.4**
  
  - [ ]* 3.4 Write property test for independent transcription updates
    - **Property 6: Independent Transcription Updates**
    - **Validates: Requirements 3.3**

- [x] 4. Implement keyboard shortcut handling
  - [x] 4.1 Create KeyboardShortcutHandler component
    - Implement Ctrl+Enter handler that triggers LLM processing
    - Add guard to prevent processing when both transcriptions are empty
    - Implement navigation to LLM response page after processing
    - Add Escape key handler to close popover (when not capturing)
    - _Requirements: 4.1, 4.3, 4.5_
  
  - [ ]* 4.2 Write property test for keyboard shortcut trigger
    - **Property 8: Keyboard Shortcut Trigger**
    - **Validates: Requirements 4.1**
  
  - [ ]* 4.3 Write property test for empty transcription guard
    - **Property 12: Empty Transcription Guard**
    - **Validates: Requirements 4.5**
  
  - [ ]* 4.4 Write property test for keyboard shortcut response time
    - **Property 28: Keyboard Shortcut Response Time**
    - **Validates: Requirements 9.3**

- [x] 5. Implement LLM processing integration
  - [x] 5.1 Create processTranscriptions function in useDualAudio
    - Combine both transcription texts into a single context
    - Add source metadata (system audio vs microphone) to each transcription
    - Call existing fetchAIResponse with dual context
    - Implement navigation to response page
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ]* 5.2 Write property test for dual context transmission
    - **Property 9: Dual Context Transmission**
    - **Validates: Requirements 4.2**
  
  - [ ]* 5.3 Write property test for source metadata inclusion
    - **Property 11: Source Metadata Inclusion**
    - **Validates: Requirements 4.4**
  
  - [ ]* 5.4 Write property test for post-processing navigation
    - **Property 10: Post-Processing Navigation**
    - **Validates: Requirements 4.3**

- [x] 6. Checkpoint - Ensure backend and hooks are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create AudioVisualization component
  - [x] 7.1 Implement canvas-based audio visualization
    - Create component with canvas element for waveform rendering
    - Implement animation loop using requestAnimationFrame
    - Add updateLevel function to update visualization based on audio level
    - Implement color coding (green for active, gray for inactive, red for error)
    - Add start/stop functions for animation control
    - _Requirements: 1.4, 6.2, 6.4_
  
  - [ ]* 7.2 Write property test for active visualization display
    - **Property 15: Active Visualization Display**
    - **Validates: Requirements 1.4**
  
  - [ ]* 7.3 Write property test for visualization start latency
    - **Property 26: Visualization Start Latency**
    - **Validates: Requirements 9.1**

- [x] 8. Create TranscriptionDisplay component
  - [x] 8.1 Implement transcription text display
    - Create component with scrollable text area
    - Implement auto-scroll to bottom on text updates
    - Add loading indicator for processing state
    - Add placeholder text for empty state
    - Add copy-to-clipboard button
    - _Requirements: 3.1, 3.2, 3.5_
  
  - [ ]* 8.2 Write unit tests for TranscriptionDisplay
    - Test auto-scroll behavior
    - Test loading state display
    - Test copy-to-clipboard functionality
    - _Requirements: 3.1, 3.2_

- [x] 9. Create StatusIndicator component
  - [x] 9.1 Implement status indicator with tooltip
    - Create component with status dot (idle, capturing, processing, error)
    - Implement color coding for each status
    - Add pulsing animation for capturing state
    - Implement tooltip with detailed status information on hover
    - _Requirements: 1.5, 6.4, 7.4, 7.5_
  
  - [ ]* 9.2 Write property test for status indicator accuracy
    - **Property 19: Status Indicator Accuracy**
    - **Validates: Requirements 7.4**
  
  - [ ]* 9.3 Write property test for status tooltip display
    - **Property 20: Status Tooltip Display**
    - **Validates: Requirements 7.5**

- [x] 10. Create AudioPane component
  - [x] 10.1 Implement reusable audio pane
    - Create component that combines AudioVisualization, TranscriptionDisplay, and StatusIndicator
    - Add header with title and icon
    - Display device name
    - Implement error message display for source-specific errors
    - Add styling for visual separation
    - _Requirements: 1.2, 1.3, 5.4, 7.1, 7.3_
  
  - [ ]* 10.2 Write property test for error message routing
    - **Property 17: Error Message Routing**
    - **Validates: Requirements 7.1, 7.3**
  
  - [ ]* 10.3 Write property test for device name display
    - **Property 14: Device Name Display**
    - **Validates: Requirements 5.4**

- [x] 11. Create DualPaneContainer component
  - [x] 11.1 Implement two-column layout container
    - Create component with two equal-width columns
    - Add vertical divider between panes
    - Implement responsive layout with minimum width constraints
    - Render AudioPane components for system audio and microphone
    - _Requirements: 1.1, 1.3, 6.1_
  
  - [ ]* 11.2 Write unit tests for DualPaneContainer
    - Test two-column layout rendering
    - Test both panes are rendered
    - Test visual separation between panes
    - _Requirements: 1.1, 1.3, 6.1_

- [x] 12. Create DualAudioButton component
  - [x] 12.1 Implement trigger button with visual states
    - Create button component with combined headphones + mic icon
    - Implement visual states (idle, capturing, error, processing)
    - Add animated pulse for capturing state
    - Add color coding (green for capturing, red for error)
    - Add loading spinner for processing state
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 12.2 Write property test for capture visual feedback
    - **Property 16: Capture Visual Feedback**
    - **Validates: Requirements 6.4**

- [x] 13. Create DualAudioPopover component
  - [x] 13.1 Implement popover container
    - Create popover component using existing Popover UI component
    - Add header with title and close button
    - Integrate DualPaneContainer
    - Add footer with device selection link and Ctrl+Enter hint
    - Integrate KeyboardShortcutHandler
    - Implement open/close state management
    - _Requirements: 1.1, 1.2, 4.1, 5.1_
  
  - [ ]* 13.2 Write unit tests for DualAudioPopover
    - Test popover opens and closes correctly
    - Test header and footer rendering
    - Test keyboard shortcut integration
    - _Requirements: 1.1, 4.1_

- [x] 14. Create main DualAudioInterface component
  - [x] 14.1 Implement main interface component
    - Create component that integrates DualAudioButton and DualAudioPopover
    - Connect to useDualAudio hook
    - Implement capture start/stop logic
    - Handle popover open/close
    - Pass state to child components
    - _Requirements: 1.1, 2.1, 2.2_
  
  - [ ]* 14.2 Write integration tests for DualAudioInterface
    - Test full capture workflow (start, transcribe, stop)
    - Test keyboard shortcut workflow (Ctrl+Enter processing)
    - Test error handling across components
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [x] 15. Checkpoint - Ensure all UI components are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Implement device persistence
  - [x] 16.1 Add localStorage persistence for device selections
    - Implement save function that stores both device IDs to localStorage
    - Implement load function that retrieves device IDs on mount
    - Use existing STORAGE_KEYS constants
    - Integrate with useDualAudio hook
    - _Requirements: 2.5, 8.4_
  
  - [ ]* 16.2 Write property test for device persistence round trip
    - **Property 4: Device Persistence Round Trip**
    - **Validates: Requirements 2.5**
  
  - [ ]* 16.3 Write property test for localStorage persistence
    - **Property 24: LocalStorage Persistence**
    - **Validates: Requirements 8.4**

- [x] 17. Implement device hot-swap functionality
  - [x] 17.1 Add device switching without capture restart
    - Implement device change handlers in useDualAudio
    - Update Tauri backend to support device switching during capture
    - Add device name display updates
    - Implement error handling for device switch failures
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [ ]* 17.2 Write property test for device hot-swap
    - **Property 13: Device Hot-Swap**
    - **Validates: Requirements 5.2, 5.3, 5.5**
  
  - [ ]* 17.3 Write property test for device switch latency
    - **Property 29: Device Switch Latency**
    - **Validates: Requirements 9.5**

- [x] 18. Integrate with existing audio device selection
  - [x] 18.1 Connect DualAudioInterface to AudioSelection component
    - Add link from DualAudioPopover footer to audio settings
    - Ensure device changes in AudioSelection update DualAudioInterface
    - Maintain compatibility with existing device selection flow
    - _Requirements: 5.1, 8.1_
  
  - [ ]* 18.2 Write property test for audio device selection compatibility
    - **Property 21: Audio Device Selection Compatibility**
    - **Validates: Requirements 8.1**
  
  - [ ]* 18.3 Write property test for Tauri command reuse
    - **Property 22: Tauri Command Reuse**
    - **Validates: Requirements 8.2**

- [x] 19. Implement permission error handling
  - [x] 19.1 Add permission error detection and instructions
    - Detect missing audio device permissions
    - Display platform-specific instructions for granting permissions
    - Add retry mechanism after permission grant
    - Integrate with existing permission flow patterns
    - _Requirements: 7.2_
  
  - [ ]* 19.2 Write property test for permission error instructions
    - **Property 18: Permission Error Instructions**
    - **Validates: Requirements 7.2**

- [x] 20. Implement transcription pane routing
  - [x] 20.1 Ensure correct transcription routing
    - Verify system audio transcriptions route to left pane
    - Verify microphone transcriptions route to right pane
    - Add visual labels to distinguish sources
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ]* 20.2 Write property test for transcription pane routing
    - **Property 5: Transcription Pane Routing**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ]* 20.3 Write property test for transcription update latency
    - **Property 27: Transcription Update Latency**
    - **Validates: Requirements 9.2**

- [x] 21. Implement legacy button hiding
  - [x] 21.1 Hide separate audio buttons when unified interface is active
    - Add state management to track unified interface activation
    - Conditionally render or disable separate microphone button
    - Conditionally render or disable separate system audio button
    - Add feature flag for gradual rollout
    - _Requirements: 8.5_
  
  - [ ]* 21.2 Write property test for legacy button hiding
    - **Property 25: Legacy Button Hiding**
    - **Validates: Requirements 8.5**

- [x] 22. Implement keyboard shortcut compatibility
  - [x] 22.1 Ensure existing shortcuts still work
    - Verify existing shortcuts don't conflict with Ctrl+Enter
    - Test all existing keyboard shortcuts with unified interface active
    - Update keyboard shortcut documentation
    - _Requirements: 8.3_
  
  - [ ]* 22.2 Write property test for keyboard shortcut compatibility
    - **Property 23: Keyboard Shortcut Compatibility**
    - **Validates: Requirements 8.3**

- [x] 23. Add animations and polish
  - [x] 23.1 Implement smooth transitions and animations
    - Add fade-in animation for popover
    - Add smooth transitions for status changes
    - Implement pulsing animation for active capture
    - Add smooth waveform animations
    - Optimize animation performance
    - _Requirements: 6.4_
  
  - [ ]* 23.2 Write unit tests for animations
    - Test animation triggers
    - Test animation cleanup
    - _Requirements: 6.4_

- [ ] 24. Checkpoint - Final integration and testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 25. Integration and final wiring
  - [ ] 25.1 Wire DualAudioInterface into main application
    - Add DualAudioInterface to main app layout
    - Replace or supplement existing audio buttons
    - Ensure proper context providers are available
    - Test full end-to-end workflow
    - _Requirements: 1.1, 2.1, 2.2, 4.1, 4.2, 4.3_
  
  - [ ]* 25.2 Write end-to-end integration tests
    - Test complete capture and transcription workflow
    - Test LLM processing with dual transcriptions
    - Test device switching during capture
    - Test error recovery scenarios
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 7.1, 7.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: backend → hooks → components → integration
- Feature flag allows gradual rollout and easy rollback if needed
