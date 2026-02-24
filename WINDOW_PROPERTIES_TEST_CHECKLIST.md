# Window Properties Preservation Test Checklist

## Task 10.1: Verify that changing always-on-top preserves other window properties

This checklist provides step-by-step verification for Requirements 6.1, 6.2, and 6.3.

---

## Test Environment Setup

- [ ] Application is built and running: `npm run tauri dev`
- [ ] Settings panel is accessible
- [ ] Always-on-top toggle is visible in settings

---

## Test 1: Window Position Preservation (Requirement 6.1)

### Objective
Verify that window position (x, y coordinates) remains unchanged when toggling always-on-top.

### Steps

1. **Record Initial Position**
   - [ ] Open the DontCaught application
   - [ ] Note the window's position on screen (e.g., top-center)
   - [ ] Take a screenshot or note the exact pixel coordinates if possible

2. **Toggle Always-On-Top OFF**
   - [ ] Open Settings
   - [ ] Find "Always on top" toggle
   - [ ] Click to disable (toggle OFF)
   - [ ] Observe: Window position should NOT change

3. **Verify Position Unchanged**
   - [ ] Window is still in the same position
   - [ ] No movement detected
   - [ ] Compare with initial screenshot/notes

4. **Toggle Always-On-Top ON**
   - [ ] Click the toggle to enable (toggle ON)
   - [ ] Observe: Window position should NOT change

5. **Verify Position Still Unchanged**
   - [ ] Window is still in the original position
   - [ ] No movement detected throughout the test

### Expected Result
✅ Window position remains constant regardless of always-on-top state changes

---

## Test 2: Window Size Preservation (Requirement 6.2)

### Objective
Verify that window size (width, height) remains unchanged when toggling always-on-top.

### Steps

1. **Record Initial Size**
   - [ ] Note the window's current size
   - [ ] If possible, use developer tools to check exact dimensions
   - [ ] Take a screenshot for reference

2. **Toggle Always-On-Top OFF**
   - [ ] Open Settings
   - [ ] Disable "Always on top" toggle
   - [ ] Observe: Window size should NOT change

3. **Verify Size Unchanged**
   - [ ] Window width is the same
   - [ ] Window height is the same
   - [ ] No resize animation or flicker

4. **Toggle Always-On-Top ON**
   - [ ] Enable "Always on top" toggle
   - [ ] Observe: Window size should NOT change

5. **Verify Size Still Unchanged**
   - [ ] Window dimensions remain constant
   - [ ] No resize occurred during any toggle

### Expected Result
✅ Window size remains constant regardless of always-on-top state changes

---

## Test 3: Taskbar Visibility Preservation (Requirement 6.3)

### Objective
Verify that taskbar visibility setting is not affected by always-on-top changes.

### Steps

1. **Set Initial Taskbar State**
   - [ ] Open Settings
   - [ ] Set "Hide from taskbar" to ON
   - [ ] Verify window is hidden from taskbar

2. **Toggle Always-On-Top OFF**
   - [ ] Disable "Always on top" toggle
   - [ ] Check taskbar: Window should still be hidden

3. **Verify Taskbar State Unchanged**
   - [ ] Window is still hidden from taskbar
   - [ ] No taskbar icon appeared

4. **Toggle Always-On-Top ON**
   - [ ] Enable "Always on top" toggle
   - [ ] Check taskbar: Window should still be hidden

5. **Verify Taskbar State Still Unchanged**
   - [ ] Window remains hidden from taskbar
   - [ ] Taskbar visibility is independent of always-on-top

6. **Test Reverse Scenario**
   - [ ] Set "Hide from taskbar" to OFF
   - [ ] Toggle always-on-top OFF and ON multiple times
   - [ ] Verify window remains visible in taskbar throughout

### Expected Result
✅ Taskbar visibility remains independent of always-on-top state

---

## Test 4: Multiple Property Preservation (Combined Test)

### Objective
Verify all properties are preserved simultaneously during rapid toggling.

### Steps

1. **Set Known State**
   - [ ] Position window at specific location
   - [ ] Note exact position and size
   - [ ] Set taskbar visibility to hidden
   - [ ] Set always-on-top to ON

2. **Rapid Toggle Test**
   - [ ] Toggle always-on-top OFF
   - [ ] Immediately toggle always-on-top ON
   - [ ] Repeat 5 times rapidly

3. **Verify All Properties**
   - [ ] Window position unchanged
   - [ ] Window size unchanged
   - [ ] Taskbar visibility unchanged
   - [ ] No visual glitches or flickers

### Expected Result
✅ All window properties remain stable during rapid state changes

---

## Test 5: Always-On-Top Functionality Verification

### Objective
Verify that always-on-top actually works while preserving other properties.

### Steps

1. **Enable Always-On-Top**
   - [ ] Set "Always on top" to ON
   - [ ] Note window position and size

2. **Test Z-Order Behavior**
   - [ ] Open another application (e.g., browser, text editor)
   - [ ] Click on the other application
   - [ ] Verify: DontCaught window stays on top
   - [ ] Verify: Window position unchanged
   - [ ] Verify: Window size unchanged

3. **Disable Always-On-Top**
   - [ ] Set "Always on top" to OFF
   - [ ] Verify: Window position unchanged
   - [ ] Verify: Window size unchanged

4. **Test Normal Z-Order**
   - [ ] Click on another application
   - [ ] Verify: DontCaught window goes behind
   - [ ] Verify: Window position unchanged when brought back to front

### Expected Result
✅ Always-on-top functionality works correctly without affecting other properties

---

## Test 6: Cross-Feature Independence

### Objective
Verify always-on-top works independently with hide-from-taskbar feature.

### Steps

1. **Test All Combinations**
   - [ ] Always-on-top: ON, Hide-from-taskbar: ON
     - Verify both features work
     - Note position and size
   
   - [ ] Toggle always-on-top to OFF
     - Verify taskbar state unchanged
     - Verify position and size unchanged
   
   - [ ] Toggle always-on-top to ON
     - Verify taskbar state unchanged
     - Verify position and size unchanged
   
   - [ ] Toggle hide-from-taskbar to OFF
     - Verify always-on-top state unchanged
     - Verify position and size unchanged

### Expected Result
✅ Both features operate independently without affecting each other or window properties

---

## Test 7: Application Restart Persistence

### Objective
Verify properties are preserved across application restarts.

### Steps

1. **Set Initial State**
   - [ ] Position window at specific location
   - [ ] Set always-on-top to ON
   - [ ] Set hide-from-taskbar to ON
   - [ ] Note exact position and size

2. **Restart Application**
   - [ ] Close DontCaught
   - [ ] Reopen DontCaught

3. **Verify State Restored**
   - [ ] Window position matches initial position
   - [ ] Window size matches initial size
   - [ ] Always-on-top is still ON
   - [ ] Hide-from-taskbar is still ON

4. **Toggle and Restart Again**
   - [ ] Toggle always-on-top to OFF
   - [ ] Note position and size
   - [ ] Restart application
   - [ ] Verify position, size, and always-on-top state all restored correctly

### Expected Result
✅ All properties persist correctly across application restarts

---

## Platform-Specific Tests

### Windows

- [ ] Test on Windows 10
- [ ] Test on Windows 11
- [ ] Verify SetWindowPos behavior
- [ ] Check taskbar integration

### macOS

- [ ] Test on macOS (latest version)
- [ ] Verify NSWindow.level behavior
- [ ] Check Dock integration
- [ ] Test with multiple displays

### Linux

- [ ] Test on Ubuntu/Debian
- [ ] Test on Fedora/RHEL
- [ ] Verify window manager compatibility
- [ ] Check panel integration

---

## Summary Checklist

After completing all tests above:

- [ ] All position preservation tests passed (Requirement 6.1)
- [ ] All size preservation tests passed (Requirement 6.2)
- [ ] All other properties preservation tests passed (Requirement 6.3)
- [ ] Always-on-top functionality works correctly
- [ ] No regressions or side effects observed
- [ ] Cross-platform compatibility verified

---

## Test Results

**Date:** _________________

**Tester:** _________________

**Platform:** _________________

**Result:** ☐ PASS  ☐ FAIL

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## Conclusion

If all tests pass, Task 10.1 is complete and Requirements 6.1, 6.2, and 6.3 are verified.

**Sign-off:**

- [ ] All tests completed
- [ ] All requirements verified
- [ ] Documentation updated
- [ ] Ready for production
