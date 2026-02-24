# Keyboard Shortcuts Documentation

## Unified Dual-Audio Interface Shortcuts

### Ctrl+Enter (Cmd+Enter on macOS)
**Action:** Process Transcriptions and Navigate to LLM Response

**When Active:** Only when the Dual-Audio Interface popover is open

**Behavior:**
- Combines both system audio and microphone transcriptions
- Sends the dual context to the LLM for processing
- Automatically navigates to the LLM response page
- Prevented when both transcription panes are empty (shows notification)

**Requirements:** 4.1, 4.2, 4.3, 4.5

---

### Escape
**Action:** Close Dual-Audio Interface Popover

**When Active:** Only when the popover is open AND not currently capturing audio

**Behavior:**
- Closes the dual-audio interface popover
- Does not stop active audio capture (prevented during capture)
- Returns focus to the main application

**Requirements:** 4.1

---

## Existing Global Shortcuts (No Conflicts)

The following global shortcuts continue to work normally when the unified interface is active:

### Ctrl+Shift+D (Cmd+Shift+D on macOS)
**Action:** Toggle Dashboard
- Opens/closes the dashboard window
- No conflict with Ctrl+Enter (uses Shift modifier)

### Ctrl+Backslash (Cmd+Backslash on macOS)
**Action:** Toggle Window
- Shows/hides the main window
- No conflict with Ctrl+Enter (different key)

### Ctrl+Shift+I (Cmd+Shift+I on macOS)
**Action:** Refocus Input Box
- Brings application forward and focuses input area
- No conflict with Ctrl+Enter (uses Shift modifier)

### Ctrl (Cmd on macOS)
**Action:** Move Window
- Hold to move overlay with arrow keys
- No conflict with Ctrl+Enter (modifier only, no Enter key)

### Ctrl+Shift+M (Cmd+Shift+M on macOS)
**Action:** Toggle System Audio Capture
- Toggles system audio capture on/off
- No conflict with Ctrl+Enter (uses Shift modifier)
- Note: May be hidden when unified interface is active (Requirement 8.5)

### Ctrl+Shift+A (Cmd+Shift+A on macOS)
**Action:** Voice Input
- Starts voice recording
- No conflict with Ctrl+Enter (uses Shift modifier)
- Note: May be hidden when unified interface is active (Requirement 8.5)

### Ctrl+Shift+S (Cmd+Shift+S on macOS)
**Action:** Screenshot
- Captures screenshot
- No conflict with Ctrl+Enter (uses Shift modifier)

---

## Enter Key Handlers in Other Components

The following components use the Enter key for form submission or actions. These do NOT conflict with Ctrl+Enter:

### Plain Enter (without modifiers)
**Used in:**
- Chat completion input (`useChatCompletion.ts`)
- Text completion input (`useCompletion.ts`)
- System audio recording (`useSystemAudio.ts`)
- Quick actions input (`QuickActions.tsx`)
- License activation (`PluelyApiSetup.tsx`)

**Behavior:**
- These handlers explicitly check for `!e.ctrlKey` and `!e.metaKey`
- They only trigger on plain Enter key (no modifiers)
- Ctrl+Enter is ignored by these handlers, preventing conflicts
- This ensures the dual-audio Ctrl+Enter shortcut works independently

### Shift+Enter
**Used in:**
- Multi-line text input (allows new line)
- Does not conflict with Ctrl+Enter

---

## Conflict Prevention Strategy

### 1. Modifier Key Separation
- Existing global shortcuts use **Ctrl+Shift** combinations
- New dual-audio shortcut uses **Ctrl** (without Shift)
- This provides clear separation and prevents conflicts

### 2. Scoped Activation
- Ctrl+Enter only active when dual-audio popover is open
- Uses `isActive` prop to control handler registration
- Automatically cleaned up when component unmounts

### 3. Event Prevention
- Both Ctrl+Enter and Escape call `event.preventDefault()`
- Prevents default browser behavior
- Stops event propagation to other handlers

### 4. Explicit Modifier Checks
- Existing Enter handlers check for `!ctrlKey` and `!metaKey`
- Ensures plain Enter doesn't trigger when Ctrl is pressed
- Allows Ctrl+Enter to be handled separately

---

## Testing

Comprehensive tests are provided in `keyboard-shortcut-compatibility.test.tsx`:

1. **Isolation Tests:** Verify Ctrl+Enter only triggers when active
2. **Conflict Tests:** Verify no conflicts with existing shortcuts
3. **Enter Key Tests:** Verify no conflicts with plain Enter handlers
4. **Escape Key Tests:** Verify Escape behavior with capture state
5. **Event Propagation Tests:** Verify preventDefault works correctly
6. **Configuration Tests:** Verify no duplicate shortcuts in config
7. **Cleanup Tests:** Verify proper event listener cleanup

---

## Implementation Notes

### KeyboardShortcutHandler Component
- Invisible component (renders null)
- Attaches event listeners to `window` object
- Uses `useEffect` for lifecycle management
- Properly cleans up listeners on unmount

### Best Practices
1. Always check `isActive` before handling shortcuts
2. Always call `preventDefault()` to prevent default behavior
3. Use both `ctrlKey` and `metaKey` for cross-platform support
4. Clean up event listeners in useEffect return function
5. Test shortcuts with multiple component instances

---

## Future Considerations

### Adding New Shortcuts
When adding new shortcuts to the dual-audio interface:
1. Check for conflicts with existing global shortcuts
2. Use Ctrl (without Shift) for dual-audio specific shortcuts
3. Document the new shortcut in this file
4. Add tests to `keyboard-shortcut-compatibility.test.tsx`
5. Update the UI hints in `DualAudioPopover.tsx`

### Customization
Future enhancements could include:
- User-configurable shortcuts for dual-audio interface
- Integration with global shortcut configuration system
- Shortcut hints in tooltips and help documentation
- Accessibility improvements for keyboard-only navigation

---

## References

- **Requirements:** 8.3 (Keyboard Shortcut Compatibility)
- **Design Document:** Section on Keyboard Shortcut Integration
- **Implementation:** `KeyboardShortcutHandler.tsx`
- **Tests:** `keyboard-shortcut-compatibility.test.tsx`
- **Configuration:** `src/config/shortcuts.ts`
