# Design Document: Unified Dual-Audio Interface

## Overview

The unified dual-audio interface consolidates microphone and system audio capture into a single, streamlined interface that displays both audio sources simultaneously. This design enables real-time transcription of both audio streams side-by-side, with integrated keyboard shortcuts for efficient workflow. The interface replaces the current separate audio capture buttons with a unified experience inspired by Cluely's clean, dual-pane approach.

### Key Design Principles

1. **Unified Experience**: Single interface for both audio sources, eliminating context switching
2. **Real-Time Feedback**: Simultaneous visualization and transcription for both streams
3. **Keyboard-First Workflow**: Ctrl+Enter shortcut for quick LLM processing
4. **Clean Visual Design**: Clear separation between sources with minimal UI
5. **Backward Compatibility**: Maintains existing audio device selection and Tauri backend integration

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Application UI                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Unified Dual-Audio Button (Trigger)           │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Dual-Audio Popover Interface                  │  │
│  │  ┌──────────────────┬──────────────────┐             │  │
│  │  │  System Audio    │  Microphone      │             │  │
│  │  │  Pane            │  Pane            │             │  │
│  │  │  ┌────────────┐  │  ┌────────────┐  │             │  │
│  │  │  │Waveform    │  │  │Waveform    │  │             │  │
│  │  │  └────────────┘  │  └────────────┘  │             │  │
│  │  │  ┌────────────┐  │  ┌────────────┐  │             │  │
│  │  │  │Transcription│  │  │Transcription│  │             │  │
│  │  │  │Text        │  │  │Text        │  │             │  │
│  │  │  └────────────┘  │  └────────────┘  │             │  │
│  │  └──────────────────┴──────────────────┘             │  │
│  │  [Ctrl+Enter to Process]                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  useDualAudio Hook                           │
│  ┌──────────────────┬──────────────────┐                    │
│  │ useSystemAudio   │ useMicrophone    │                    │
│  │ (existing)       │ (new/adapted)    │                    │
│  └──────────────────┴──────────────────┘                    │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────┐                    │
│  │  Dual Stream Coordinator            │                    │
│  │  - Synchronize start/stop           │                    │
│  │  - Manage transcriptions            │                    │
│  │  - Handle keyboard shortcuts        │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Tauri Backend (Rust)                        │
│  ┌──────────────────┬──────────────────┐                    │
│  │ System Audio     │ Microphone       │                    │
│  │ Capture          │ Capture          │                    │
│  │ (existing)       │ (new/adapted)    │                    │
│  └──────────────────┴──────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
DualAudioInterface (new)
├── DualAudioButton (new)
│   └── Trigger for popover
├── DualAudioPopover (new)
│   ├── Header
│   │   ├── Title
│   │   └── Close Button
│   ├── DualPaneContainer (new)
│   │   ├── AudioPane (new) - System Audio
│   │   │   ├── AudioVisualization (new)
│   │   │   ├── TranscriptionDisplay (new)
│   │   │   └── StatusIndicator (new)
│   │   └── AudioPane (new) - Microphone
│   │       ├── AudioVisualization (new)
│   │       ├── TranscriptionDisplay (new)
│   │       └── StatusIndicator (new)
│   ├── Footer
│   │   ├── DeviceSelectionLink
│   │   └── ProcessButton (Ctrl+Enter hint)
│   └── KeyboardShortcutHandler (new)
```

## Components and Interfaces

### 1. DualAudioInterface Component

Main container component that orchestrates the unified dual-audio experience.

**Props:**
```typescript
interface DualAudioInterfaceProps {
  // No props - uses context and hooks
}
```

**Responsibilities:**
- Render the trigger button
- Manage popover open/close state
- Coordinate between system audio and microphone hooks
- Handle keyboard shortcuts (Ctrl+Enter)

### 2. DualAudioButton Component

Trigger button that opens the dual-audio interface.

**Props:**
```typescript
interface DualAudioButtonProps {
  isCapturing: boolean;
  hasError: boolean;
  onClick: () => void;
}
```

**Visual States:**
- Idle: Default icon (combined headphones + mic icon)
- Capturing: Animated pulse with green accent
- Error: Red accent with alert icon
- Processing: Loading spinner

### 3. DualPaneContainer Component

Container that holds both audio panes side-by-side.

**Props:**
```typescript
interface DualPaneContainerProps {
  systemAudioPane: ReactNode;
  microphonePane: ReactNode;
}
```

**Layout:**
- Two equal-width columns
- Vertical divider between panes
- Responsive to window size
- Minimum width per pane: 300px

### 4. AudioPane Component

Reusable component for displaying a single audio source.

**Props:**
```typescript
interface AudioPaneProps {
  title: string; // "System Audio" or "Microphone"
  icon: ReactNode;
  isCapturing: boolean;
  audioLevel: number; // 0-100
  transcription: string;
  status: 'idle' | 'capturing' | 'processing' | 'error';
  errorMessage?: string;
  deviceName: string;
}
```

**Sub-components:**
- Header with title and icon
- AudioVisualization component
- TranscriptionDisplay component
- StatusIndicator component

### 5. AudioVisualization Component

Displays real-time audio levels as a waveform or level meter.

**Props:**
```typescript
interface AudioVisualizationProps {
  audioLevel: number; // 0-100
  isActive: boolean;
  variant: 'waveform' | 'meter';
}
```

**Implementation:**
- Canvas-based waveform visualization
- Smooth animation using requestAnimationFrame
- Color coding: green (active), gray (inactive), red (error)

### 6. TranscriptionDisplay Component

Displays transcribed text with auto-scroll.

**Props:**
```typescript
interface TranscriptionDisplayProps {
  text: string;
  isProcessing: boolean;
  placeholder: string;
}
```

**Features:**
- Auto-scroll to bottom as text updates
- Loading indicator during transcription
- Placeholder text when empty
- Copy-to-clipboard button

### 7. StatusIndicator Component

Shows the current status of an audio source.

**Props:**
```typescript
interface StatusIndicatorProps {
  status: 'idle' | 'capturing' | 'processing' | 'error';
  message?: string;
}
```

**Visual Design:**
- Idle: Gray dot
- Capturing: Pulsing green dot
- Processing: Animated spinner
- Error: Red dot with tooltip

### 8. KeyboardShortcutHandler Component

Invisible component that handles keyboard shortcuts.

**Props:**
```typescript
interface KeyboardShortcutHandlerProps {
  isActive: boolean;
  onCtrlEnter: () => void;
}
```

**Shortcuts:**
- Ctrl+Enter: Process transcriptions and navigate to LLM response
- Escape: Close popover (if not capturing)

## Data Models

### DualAudioState

```typescript
interface DualAudioState {
  // Overall state
  isOpen: boolean;
  isCapturing: boolean;
  
  // System audio state
  systemAudio: {
    isCapturing: boolean;
    audioLevel: number;
    transcription: string;
    status: AudioSourceStatus;
    error?: string;
    deviceId: string;
    deviceName: string;
  };
  
  // Microphone state
  microphone: {
    isCapturing: boolean;
    audioLevel: number;
    transcription: string;
    status: AudioSourceStatus;
    error?: string;
    deviceId: string;
    deviceName: string;
  };
}

type AudioSourceStatus = 'idle' | 'capturing' | 'processing' | 'error';
```

### TranscriptionResult

```typescript
interface TranscriptionResult {
  source: 'system' | 'microphone';
  text: string;
  timestamp: number;
  confidence?: number;
}
```

### DualTranscriptionContext

```typescript
interface DualTranscriptionContext {
  systemAudioText: string;
  microphoneText: string;
  timestamp: number;
}
```

## Hooks

### useDualAudio Hook

Main hook that coordinates both audio sources.

**Interface:**
```typescript
interface UseDualAudioReturn {
  // State
  state: DualAudioState;
  
  // Actions
  startCapture: () => Promise<void>;
  stopCapture: () => Promise<void>;
  toggleCapture: () => Promise<void>;
  processTranscriptions: () => Promise<void>;
  
  // Device management
  selectSystemAudioDevice: (deviceId: string) => void;
  selectMicrophoneDevice: (deviceId: string) => void;
  
  // Popover control
  openInterface: () => void;
  closeInterface: () => void;
}
```

**Implementation Strategy:**
- Compose existing `useSystemAudio` hook for system audio
- Create new `useMicrophone` hook for microphone capture
- Synchronize start/stop operations
- Merge transcription results
- Handle keyboard shortcuts

### useMicrophone Hook

New hook for microphone capture (mirrors useSystemAudio structure).

**Interface:**
```typescript
interface UseMicrophoneReturn {
  isCapturing: boolean;
  audioLevel: number;
  transcription: string;
  status: AudioSourceStatus;
  error?: string;
  startCapture: () => Promise<void>;
  stopCapture: () => Promise<void>;
  deviceId: string;
  deviceName: string;
}
```

**Implementation:**
- Use existing Tauri commands for microphone input
- Implement VAD (Voice Activity Detection) similar to system audio
- Real-time transcription using STT provider
- Audio level monitoring

### useAudioVisualization Hook

Hook for managing audio visualization state.

**Interface:**
```typescript
interface UseAudioVisualizationReturn {
  canvasRef: RefObject<HTMLCanvasElement>;
  updateLevel: (level: number) => void;
  start: () => void;
  stop: () => void;
}
```

**Implementation:**
- Canvas-based rendering
- Smooth animation loop
- Configurable visualization style

## Tauri Backend Integration

### Existing Commands (Reuse)

```rust
// Already implemented
#[tauri::command]
async fn start_system_audio_capture(
    vad_config: VadConfig,
    device_id: Option<String>
) -> Result<String, String>

#[tauri::command]
async fn stop_system_audio_capture() -> Result<String, String>

#[tauri::command]
async fn get_input_devices() -> Result<Vec<AudioDevice>, String>

#[tauri::command]
async fn get_output_devices() -> Result<Vec<AudioDevice>, String>
```

### New Commands (To Implement)

```rust
// New command for microphone capture with VAD
#[tauri::command]
async fn start_microphone_capture(
    vad_config: VadConfig,
    device_id: Option<String>
) -> Result<String, String>

#[tauri::command]
async fn stop_microphone_capture() -> Result<String, String>

// Get audio levels for visualization
#[tauri::command]
async fn get_audio_levels() -> Result<AudioLevels, String>

// Data structure for audio levels
struct AudioLevels {
    system_audio_level: f32,  // 0.0 - 1.0
    microphone_level: f32,     // 0.0 - 1.0
}
```

### Events

```rust
// Existing events (reuse)
"speech-detected" // Emitted when VAD detects speech
"recording-progress" // Emitted during continuous recording
"audio-encoding-error" // Emitted on encoding errors

// New events
"microphone-speech-detected" // Emitted when microphone VAD detects speech
"audio-levels-update" // Emitted periodically with audio levels
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following consolidations to eliminate redundancy:

**Redundancies Identified:**
1. Properties 3.1 and 3.2 (transcription display location) can be combined into a single property about correct pane routing
2. Properties 2.1 and 2.2 (simultaneous start/stop) can be combined into a single property about synchronized operations
3. Properties 5.2 and 5.3 (device switching) can be combined into a single property about device updates
4. Properties 7.1 and 7.3 (error display) can be combined into a single property about error routing to correct pane
5. Several "example" test cases (1.1, 1.2, 1.3, 1.5, 3.4, 5.1, 6.1, 6.2, 6.3) are about initial UI structure and can be validated together in integration tests rather than separate properties

**Retained Properties:**
- Keep performance properties (9.1, 9.2, 9.3, 9.5) as separate since they test different timing requirements
- Keep keyboard shortcut properties (4.1-4.5) as they test different aspects of the workflow
- Keep independence properties (2.3, 3.3) as they test critical isolation requirements

### Correctness Properties

Property 1: Synchronized Capture Operations
*For any* dual-audio interface state, when capture is started or stopped, both system audio and microphone should transition to the same capturing state (both capturing or both stopped) simultaneously
**Validates: Requirements 2.1, 2.2**

Property 2: Independent Audio Stream Isolation
*For any* audio data captured during a session, audio data from the system audio source should never appear in the microphone transcription, and vice versa
**Validates: Requirements 2.3**

Property 3: Graceful Partial Failure
*For any* audio source initialization attempt, if one source fails to initialize, the other source should continue operating normally and the failed source should display a source-specific error message
**Validates: Requirements 2.4**

Property 4: Device Persistence Round Trip
*For any* selected audio device configuration, after saving the configuration and restarting the application, the same devices should be selected
**Validates: Requirements 2.5**

Property 5: Transcription Pane Routing
*For any* transcription event, system audio transcriptions should appear only in the left pane and microphone transcriptions should appear only in the right pane
**Validates: Requirements 3.1, 3.2**

Property 6: Independent Transcription Updates
*For any* transcription update to one pane, the content of the other pane should remain unchanged
**Validates: Requirements 3.3**

Property 7: Transcription Preservation
*For any* completed transcription session, the final transcribed text should remain in both panes after transcription completes
**Validates: Requirements 3.5**

Property 8: Keyboard Shortcut Trigger
*For any* state where the dual-audio interface is active, pressing Ctrl+Enter should trigger LLM processing
**Validates: Requirements 4.1**

Property 9: Dual Context Transmission
*For any* LLM processing request, both transcription texts (system audio and microphone) should be included in the context sent to the LLM
**Validates: Requirements 4.2**

Property 10: Post-Processing Navigation
*For any* LLM processing trigger, the system should navigate to the LLM response page after processing begins
**Validates: Requirements 4.3**

Property 11: Source Metadata Inclusion
*For any* transcription sent to the LLM, the data should include metadata indicating whether the text came from system audio or microphone
**Validates: Requirements 4.4**

Property 12: Empty Transcription Guard
*For any* state where both transcription panes are empty, attempting to trigger LLM processing should be prevented and a notification should be displayed
**Validates: Requirements 4.5**

Property 13: Device Hot-Swap
*For any* device change operation, the new device should be applied to the corresponding audio source without requiring a restart of the capture process
**Validates: Requirements 5.2, 5.3, 5.5**

Property 14: Device Name Display
*For any* selected audio device, the device name should be displayed in the corresponding section of the dual-audio interface
**Validates: Requirements 5.4**

Property 15: Active Visualization Display
*For any* audio source that becomes active, an audio visualization component should be rendered for that source
**Validates: Requirements 1.4**

Property 16: Capture Visual Feedback
*For any* audio source in capturing state, visual indicators (pulsing, animation) should be active for that source
**Validates: Requirements 6.4**

Property 17: Error Message Routing
*For any* error that occurs in a specific audio source, the error message should be displayed in the corresponding pane for that source
**Validates: Requirements 7.1, 7.3**

Property 18: Permission Error Instructions
*For any* state where audio device permissions are missing, the system should display instructions for granting permissions
**Validates: Requirements 7.2**

Property 19: Status Indicator Accuracy
*For any* audio source state change, the status indicator should reflect the current state (idle, capturing, processing, error)
**Validates: Requirements 7.4**

Property 20: Status Tooltip Display
*For any* hover event over a status indicator, a tooltip with detailed status information should be displayed
**Validates: Requirements 7.5**

Property 21: Audio Device Selection Compatibility
*For any* interaction with the audio device selection component, the existing component should function correctly with the new dual-audio interface
**Validates: Requirements 8.1**

Property 22: Tauri Command Reuse
*For any* audio device query operation, the system should invoke the existing Tauri commands (get_input_devices, get_output_devices)
**Validates: Requirements 8.2**

Property 23: Keyboard Shortcut Compatibility
*For any* existing keyboard shortcut that doesn't conflict with Ctrl+Enter, the shortcut should continue to function as before
**Validates: Requirements 8.3**

Property 24: LocalStorage Persistence
*For any* device selection change, the selection should be persisted to localStorage using the existing mechanism
**Validates: Requirements 8.4**

Property 25: Legacy Button Hiding
*For any* state where the unified interface is active, the separate microphone and system audio buttons should be disabled or hidden
**Validates: Requirements 8.5**

Property 26: Visualization Start Latency
*For any* capture start operation, audio visualization should begin displaying within 500ms
**Validates: Requirements 9.1**

Property 27: Transcription Update Latency
*For any* speech completion event, the transcription pane should update within 1 second
**Validates: Requirements 9.2**

Property 28: Keyboard Shortcut Response Time
*For any* Ctrl+Enter keypress, the system should process the shortcut within 200ms
**Validates: Requirements 9.3**

Property 29: Device Switch Latency
*For any* device switching operation, the change should be applied within 2 seconds
**Validates: Requirements 9.5**

## Error Handling

### Error Categories

1. **Initialization Errors**
   - Audio device not found
   - Permission denied
   - Device already in use
   - Backend communication failure

2. **Runtime Errors**
   - Audio stream interruption
   - Transcription service failure
   - Network timeout
   - Device disconnection

3. **User Input Errors**
   - Empty transcription submission
   - Invalid device selection
   - Conflicting operations

### Error Handling Strategy

**Per-Source Error Isolation:**
- Errors in one audio source should not affect the other
- Each pane displays its own error state
- Global errors (e.g., network) affect both panes

**Error Recovery:**
- Automatic retry for transient errors (3 attempts with exponential backoff)
- Manual retry button for persistent errors
- Clear error messages with actionable instructions

**Error State Management:**
```typescript
interface ErrorState {
  source: 'system' | 'microphone' | 'global';
  type: 'initialization' | 'runtime' | 'user-input';
  message: string;
  recoverable: boolean;
  retryCount: number;
}
```

**Error Display:**
- In-pane error messages for source-specific errors
- Toast notifications for global errors
- Status indicator shows error state
- Tooltip provides detailed error information

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific UI component rendering (initial layout, labels, styling)
- Edge cases (empty transcriptions, device disconnection)
- Error conditions (permission denied, device not found)
- Integration points between components
- Keyboard shortcut handling

**Property-Based Tests** focus on:
- Universal properties across all inputs (synchronization, isolation, routing)
- State transitions (capture start/stop, device switching)
- Data persistence (round-trip properties)
- Performance requirements (latency bounds)

Together, these approaches provide comprehensive coverage: unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across all possible inputs.

### Property-Based Testing Configuration

**Testing Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: unified-dual-audio-interface, Property {N}: {property_text}`

**Example Property Test Structure:**
```typescript
import fc from 'fast-check';

// Feature: unified-dual-audio-interface, Property 2: Independent Audio Stream Isolation
test('audio streams remain isolated', () => {
  fc.assert(
    fc.property(
      fc.string(), // system audio data
      fc.string(), // microphone data
      (systemData, micData) => {
        const result = processAudioStreams(systemData, micData);
        
        // System audio data should not appear in mic transcription
        expect(result.microphoneTranscription).not.toContain(systemData);
        
        // Microphone data should not appear in system transcription
        expect(result.systemTranscription).not.toContain(micData);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Focus Areas

1. **Component Rendering**
   - DualAudioInterface renders both panes
   - Correct labels and icons displayed
   - Visual separation between panes
   - Device names displayed correctly

2. **State Management**
   - Capture state transitions
   - Error state handling
   - Transcription updates
   - Device selection changes

3. **User Interactions**
   - Button clicks
   - Keyboard shortcuts
   - Device selection
   - Error recovery actions

4. **Integration Tests**
   - Hook composition (useDualAudio)
   - Tauri command invocation
   - LocalStorage persistence
   - Navigation after LLM processing

### Test Data Generators

For property-based tests, we need generators for:

```typescript
// Audio state generator
const audioStateGen = fc.record({
  isCapturing: fc.boolean(),
  audioLevel: fc.float({ min: 0, max: 100 }),
  transcription: fc.string(),
  status: fc.constantFrom('idle', 'capturing', 'processing', 'error'),
  deviceId: fc.string(),
  deviceName: fc.string(),
});

// Dual audio state generator
const dualAudioStateGen = fc.record({
  isOpen: fc.boolean(),
  isCapturing: fc.boolean(),
  systemAudio: audioStateGen,
  microphone: audioStateGen,
});

// Transcription event generator
const transcriptionEventGen = fc.record({
  source: fc.constantFrom('system', 'microphone'),
  text: fc.string({ minLength: 1 }),
  timestamp: fc.integer({ min: 0 }),
});

// Device configuration generator
const deviceConfigGen = fc.record({
  systemAudioDeviceId: fc.string(),
  microphoneDeviceId: fc.string(),
});
```

### Performance Testing

Performance requirements should be validated through:

1. **Automated Performance Tests**
   - Measure visualization start latency
   - Measure transcription update latency
   - Measure keyboard shortcut response time
   - Measure device switch latency

2. **Performance Monitoring**
   - Log timing metrics in development
   - Alert on performance regressions
   - Track metrics over time

3. **Load Testing**
   - Test with continuous audio streams
   - Test with rapid device switching
   - Test with high-frequency transcription updates

### Mock Strategy

**Tauri Commands:**
- Mock all Tauri invoke calls
- Simulate success and error responses
- Control timing for latency tests

**Audio Streams:**
- Mock audio level updates
- Simulate speech detection events
- Control transcription timing

**LocalStorage:**
- Mock localStorage for persistence tests
- Verify correct keys and values
- Test serialization/deserialization

## Implementation Notes

### Phase 1: Core Infrastructure
1. Create useMicrophone hook (mirror useSystemAudio)
2. Create useDualAudio hook (compose both audio hooks)
3. Implement Tauri backend commands for microphone capture
4. Set up audio level monitoring

### Phase 2: UI Components
1. Create DualAudioButton component
2. Create DualPaneContainer component
3. Create AudioPane component
4. Create AudioVisualization component
5. Create TranscriptionDisplay component
6. Create StatusIndicator component

### Phase 3: Integration
1. Implement keyboard shortcut handler
2. Integrate with existing device selection
3. Implement LLM processing workflow
4. Add error handling and recovery

### Phase 4: Polish
1. Add animations and transitions
2. Optimize performance
3. Add accessibility features
4. Comprehensive testing

### Migration Strategy

**Backward Compatibility:**
- Keep existing system audio button functional during transition
- Add feature flag to enable/disable unified interface
- Gradual rollout to users

**User Communication:**
- In-app notification about new unified interface
- Tutorial or onboarding flow
- Documentation updates

**Rollback Plan:**
- Feature flag allows instant rollback
- Existing functionality remains intact
- No data migration required
