# Integration Test - Task 12.1: Complete User Flow

## Overview
This document provides a comprehensive integration test checklist for the always-on-top feature, covering all aspects of task 12.1.

**Requirements Tested:** 1.3, 1.4, 2.4, 3.2, 7.1

## Test Environment Setup

### Prerequisites
- [ ] Application is built and ready to run
- [ ] Database is accessible and initialized
- [ ] At least one other application available for testing (browser, text editor, etc.)

### Build Verification
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No critical warnings in output

---

## Test 1: Toggle Always-On-Top Multiple Times

**Objective:** Verify the always-on-top setting can be toggled on and off multiple times without issues

**Requirements:** 2.4 (Immediate application of changes)

### Steps:
1. [ ] Launch the application
2. [ ] Open Settings page
3. [ ] Locate the "Always on top" toggle
4. [ ] Note the initial state (should be ON by default)
5. [ ] Open another application (e.g., browser)
6. [ ] Verify DontCaught window stays on top
7. [ ] Return to Settings and toggle "Always on top" OFF
8. [ ] Click on the other application
9. [ ] Verify DontCaught window goes behind the other application
10. [ ] Click on DontCaught to bring it forward
11. [ ] Toggle "Always on top" ON
12. [ ] Click on the other application
13. [ ] Verify DontCaught window stays on top again
14. [ ] Repeat steps 7-13 at least 3 more times

### Expected Results:
- [ ] Each toggle change applies immediately (no restart required)
- [ ] Window behavior matches the toggle state consistently
- [ ] No errors appear in the console
- [ ] No visual glitches or delays
- [ ] Toggle UI updates correctly each time

### Status: ⏳ Pending

---

## Test 2: Setting Persistence Across Application Restarts

**Objective:** Verify the always-on-top preference persists when the application is closed and reopened

**Requirements:** 3.2 (Load saved preference on startup)

### Test 2.1: Persistence with Always-On-Top Enabled

#### Steps:
1. [ ] Launch the application
2. [ ] Open Settings page
3. [ ] Enable "Always on top" toggle (if not already enabled)
4. [ ] Verify the setting is ON
5. [ ] Close the application completely
6. [ ] Relaunch the application
7. [ ] Open Settings page
8. [ ] Check the "Always on top" toggle state
9. [ ] Open another application
10. [ ] Verify DontCaught window stays on top

#### Expected Results:
- [ ] Toggle shows "Always on top" is still enabled after restart
- [ ] Window behavior matches the saved setting (stays on top)
- [ ] No errors during startup
- [ ] Setting loads before window becomes visible

#### Status: ⏳ Pending

### Test 2.2: Persistence with Always-On-Top Disabled

#### Steps:
1. [ ] Launch the application
2. [ ] Open Settings page
3. [ ] Disable "Always on top" toggle
4. [ ] Verify the setting is OFF
5. [ ] Close the application completely
6. [ ] Relaunch the application
7. [ ] Open Settings page
8. [ ] Check the "Always on top" toggle state
9. [ ] Open another application and click on it
10. [ ] Verify DontCaught window goes behind the other application

#### Expected Results:
- [ ] Toggle shows "Always on top" is still disabled after restart
- [ ] Window behavior matches the saved setting (normal z-order)
- [ ] No errors during startup
- [ ] Setting loads correctly

#### Status: ⏳ Pending

### Test 2.3: Multiple Restart Cycles

#### Steps:
1. [ ] Set "Always on top" to ON
2. [ ] Restart application → Verify ON
3. [ ] Set "Always on top" to OFF
4. [ ] Restart application → Verify OFF
5. [ ] Set "Always on top" to ON
6. [ ] Restart application → Verify ON

#### Expected Results:
- [ ] Each restart preserves the last saved setting
- [ ] No setting corruption or reset to default
- [ ] Database persistence works reliably

#### Status: ⏳ Pending

---

## Test 3: Always-On-Top Works with Hide-From-Taskbar

**Objective:** Verify both features work together correctly

**Requirements:** 7.1 (Simultaneous operation)

### Test 3.1: Both Features Enabled

#### Steps:
1. [ ] Launch the application
2. [ ] Open Settings page
3. [ ] Enable "Always on top" toggle
4. [ ] Enable "Hide from taskbar" toggle
5. [ ] Check the system taskbar
6. [ ] Open another application (e.g., browser)
7. [ ] Click on the other application
8. [ ] Observe DontCaught window behavior

#### Expected Results:
- [ ] DontCaught window is NOT visible in the taskbar
- [ ] DontCaught window stays on top of the other application
- [ ] Both features work simultaneously without conflicts
- [ ] No errors in console

#### Status: ⏳ Pending

### Test 3.2: Toggle Always-On-Top While Hide-From-Taskbar is Enabled

#### Steps:
1. [ ] Enable both features (from Test 3.1)
2. [ ] Disable "Always on top" toggle
3. [ ] Check taskbar visibility
4. [ ] Open another application and click on it
5. [ ] Observe window behavior
6. [ ] Enable "Always on top" toggle again
7. [ ] Check taskbar visibility
8. [ ] Click on the other application

#### Expected Results:
- [ ] Taskbar visibility remains unchanged (still hidden)
- [ ] Window z-order changes correctly with always-on-top toggle
- [ ] Changing always-on-top does not affect hide-from-taskbar
- [ ] Both features remain independent

#### Status: ⏳ Pending

### Test 3.3: Toggle Hide-From-Taskbar While Always-On-Top is Enabled

#### Steps:
1. [ ] Enable both features
2. [ ] Disable "Hide from taskbar" toggle
3. [ ] Check taskbar visibility
4. [ ] Open another application and click on it
5. [ ] Observe window z-order behavior
6. [ ] Enable "Hide from taskbar" toggle again
7. [ ] Check taskbar visibility
8. [ ] Observe window z-order behavior

#### Expected Results:
- [ ] Window z-order remains unchanged (still on top)
- [ ] Taskbar visibility changes correctly with hide-from-taskbar toggle
- [ ] Changing hide-from-taskbar does not affect always-on-top
- [ ] Both features remain independent

#### Status: ⏳ Pending

### Test 3.4: All Four Combinations

#### Test Matrix:

| Test | Always On Top | Hide From Taskbar | Expected Window Behavior | Expected Taskbar Behavior |
|------|---------------|-------------------|--------------------------|---------------------------|
| 3.4.1 | ✓ ON | ✓ ON | Stays on top | Hidden from taskbar |
| 3.4.2 | ✓ ON | ✗ OFF | Stays on top | Visible in taskbar |
| 3.4.3 | ✗ OFF | ✓ ON | Normal z-order | Hidden from taskbar |
| 3.4.4 | ✗ OFF | ✗ OFF | Normal z-order | Visible in taskbar |

#### Steps for Each Combination:
1. [ ] Set toggles according to test matrix row
2. [ ] Check taskbar visibility
3. [ ] Open another application
4. [ ] Click on the other application
5. [ ] Observe DontCaught window behavior
6. [ ] Verify behavior matches expected results

#### Expected Results:
- [ ] All four combinations work correctly
- [ ] No conflicts between features
- [ ] Behavior is predictable and consistent

#### Status: ⏳ Pending

---

## Test 4: Window Stays On Top When Other Applications Are Opened

**Objective:** Verify the always-on-top behavior works correctly with various applications

**Requirements:** 1.3, 1.4 (Window remains visible above all other windows)

### Test 4.1: Single Application

#### Steps:
1. [ ] Launch DontCaught with "Always on top" enabled
2. [ ] Open a web browser
3. [ ] Maximize the browser window
4. [ ] Click on the browser window
5. [ ] Observe DontCaught window

#### Expected Results:
- [ ] DontCaught window remains visible above the browser
- [ ] DontCaught window is not obscured by the browser
- [ ] Window maintains its position and size

#### Status: ⏳ Pending

### Test 4.2: Multiple Applications

#### Steps:
1. [ ] Launch DontCaught with "Always on top" enabled
2. [ ] Open a web browser
3. [ ] Open a text editor
4. [ ] Open a file explorer
5. [ ] Click on each application in sequence
6. [ ] Observe DontCaught window after each click

#### Expected Results:
- [ ] DontCaught window stays on top of all applications
- [ ] Window remains visible regardless of which app is focused
- [ ] No z-order issues or flickering

#### Status: ⏳ Pending

### Test 4.3: Fullscreen Applications

#### Steps:
1. [ ] Launch DontCaught with "Always on top" enabled
2. [ ] Open a video player or browser
3. [ ] Enter fullscreen mode in the other application
4. [ ] Observe DontCaught window

#### Expected Results:
- [ ] DontCaught window remains visible above fullscreen content
- [ ] Window is not hidden by fullscreen applications
- [ ] (Note: Some platforms may have limitations with fullscreen)

#### Status: ⏳ Pending

### Test 4.4: Rapid Application Switching

#### Steps:
1. [ ] Launch DontCaught with "Always on top" enabled
2. [ ] Open 3-4 different applications
3. [ ] Rapidly switch between applications using Alt+Tab (Windows/Linux) or Cmd+Tab (macOS)
4. [ ] Observe DontCaught window during switching

#### Expected Results:
- [ ] DontCaught window consistently stays on top
- [ ] No flickering or z-order issues during rapid switching
- [ ] Window remains stable and visible

#### Status: ⏳ Pending

### Test 4.5: Disable Always-On-Top and Verify Normal Behavior

#### Steps:
1. [ ] With multiple applications open, disable "Always on top"
2. [ ] Click on another application
3. [ ] Observe DontCaught window
4. [ ] Click on DontCaught to bring it forward
5. [ ] Click on another application again

#### Expected Results:
- [ ] DontCaught window goes behind other applications when they're focused
- [ ] Normal z-order behavior is restored
- [ ] Window can be brought forward by clicking on it
- [ ] Behavior matches standard application window management

#### Status: ⏳ Pending

---

## Test 5: Complete User Flow End-to-End

**Objective:** Test the complete user journey from first launch to daily use

**Requirements:** All requirements (1.3, 1.4, 2.4, 3.2, 7.1)

### Steps:
1. [ ] **First Launch**
   - Launch application for the first time
   - Verify "Always on top" is enabled by default
   - Open another app and verify window stays on top

2. [ ] **Customize Settings**
   - Open Settings
   - Disable "Always on top"
   - Verify window goes behind other apps
   - Enable "Hide from taskbar"
   - Verify window is hidden from taskbar

3. [ ] **Test Persistence**
   - Close application
   - Reopen application
   - Verify both settings are preserved

4. [ ] **Daily Use Simulation**
   - Enable "Always on top"
   - Open browser for research
   - Open code editor
   - Open terminal
   - Verify DontCaught stays visible throughout

5. [ ] **Toggle During Use**
   - Disable "Always on top" temporarily
   - Work with other apps normally
   - Re-enable "Always on top"
   - Verify immediate effect

6. [ ] **Multiple Sessions**
   - Close and reopen application 3 times
   - Change settings between sessions
   - Verify persistence each time

### Expected Results:
- [ ] Complete flow works smoothly without errors
- [ ] Settings persist correctly across all sessions
- [ ] Features work independently and together
- [ ] User experience is intuitive and reliable
- [ ] No crashes, errors, or unexpected behavior

### Status: ⏳ Pending

---

## Database Verification

### Manual Database Check

#### Steps:
1. [ ] Locate the SQLite database file
2. [ ] Open with SQLite browser or CLI
3. [ ] Run query:
   ```sql
   SELECT * FROM app_settings WHERE key = 'always_on_top';
   ```
4. [ ] Verify the value matches the current setting

#### Expected Results:
- [ ] Database contains 'always_on_top' key
- [ ] Value is 'true' or 'false' matching the toggle state
- [ ] Value persists after application restart

### Status: ⏳ Pending

---

## Error Scenarios

### Test 6: Error Handling

#### Test 6.1: Database Write Failure (Simulated)
- [ ] Requires developer intervention to simulate
- [ ] Expected: Error message shown to user
- [ ] Expected: Window property still updates
- [ ] Expected: Application doesn't crash

#### Test 6.2: Window API Failure (Simulated)
- [ ] Requires developer intervention to simulate
- [ ] Expected: Error message shown to user
- [ ] Expected: Toggle state reverts or shows error
- [ ] Expected: Application doesn't crash

### Status: ⏳ Requires Developer Simulation

---

## Performance Verification

### Test 7: Performance and Responsiveness

#### Steps:
1. [ ] Toggle "Always on top" 10 times rapidly
2. [ ] Measure response time (should be < 100ms)
3. [ ] Check for memory leaks (monitor memory usage)
4. [ ] Verify no performance degradation

#### Expected Results:
- [ ] Toggle responds immediately each time
- [ ] No lag or delay in window behavior changes
- [ ] Memory usage remains stable
- [ ] CPU usage is minimal

### Status: ⏳ Pending

---

## Summary

### Test Results Overview

| Test Category | Status | Pass/Fail | Notes |
|---------------|--------|-----------|-------|
| Toggle Multiple Times | ⏳ | - | - |
| Persistence Across Restarts | ⏳ | - | - |
| Works with Hide-From-Taskbar | ⏳ | - | - |
| Window Stays On Top | ⏳ | - | - |
| Complete User Flow | ⏳ | - | - |
| Database Verification | ⏳ | - | - |
| Error Handling | ⏳ | - | - |
| Performance | ⏳ | - | - |

### Overall Status: ⏳ Pending Manual Testing

---

## Sign-Off

- [ ] All tests completed
- [ ] All tests passed
- [ ] No critical issues found
- [ ] Feature ready for production

**Tester Name:** _________________

**Date:** _________________

**Signature:** _________________

---

## Notes and Issues

_Use this section to document any issues, observations, or notes during testing:_

---

## References

- Requirements: `.kiro/specs/always-on-top/requirements.md`
- Design: `.kiro/specs/always-on-top/design.md`
- Tasks: `.kiro/specs/always-on-top/tasks.md`
- Related: `FEATURE_INTERACTION_TEST.md`
- Related: `MANUAL_TEST_CHECKLIST.md`
