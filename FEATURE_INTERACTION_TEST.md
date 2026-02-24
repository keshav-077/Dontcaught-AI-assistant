# Feature Interaction Test: Always-On-Top and Hide-From-Taskbar

This document describes manual and automated tests to verify that the always-on-top and hide-from-taskbar features work independently and can operate simultaneously.

## Requirements Being Tested

- **Requirement 7.1**: Both settings can be enabled simultaneously
- **Requirement 7.2**: Changing always-on-top doesn't affect hide-from-taskbar
- **Requirement 7.3**: Changing hide-from-taskbar doesn't affect always-on-top

## Automated Tests

### Running the Tests

1. Open the application
2. Open the browser developer console (F12)
3. Run the following command:
   ```javascript
   runFeatureInteractionTests()
   ```

The tests will automatically verify:
- Both features can be enabled simultaneously
- Changing one setting doesn't affect the other
- All combinations of settings work correctly

### Expected Output

```
=== Running Feature Interaction Tests ===

Testing simultaneous feature operation...
✓ Both features can be enabled simultaneously
Testing always-on-top independence...
✓ Changing always-on-top does not affect skip-taskbar
Testing skip-taskbar independence...
✓ Changing skip-taskbar does not affect always-on-top
Testing all setting combinations...
✓ All setting combinations work correctly

=== All Feature Interaction Tests Passed ===
```

## Manual Test Procedures

### Test 1: Simultaneous Feature Operation (Requirement 7.1)

**Objective**: Verify both features can be enabled at the same time

**Steps**:
1. Open the application settings
2. Enable "Always on top" toggle
3. Enable "Hide from taskbar" toggle
4. Open another application (e.g., browser, text editor)
5. Check the taskbar

**Expected Results**:
- The DontCaught window should stay above the other application
- The DontCaught window should NOT appear in the taskbar
- Both features should work simultaneously without conflicts

### Test 2: Always-On-Top Independence (Requirement 7.2)

**Objective**: Verify changing always-on-top doesn't affect hide-from-taskbar

**Steps**:
1. Open the application settings
2. Enable both "Always on top" and "Hide from taskbar"
3. Verify both are working (window stays on top, not in taskbar)
4. Disable "Always on top" toggle
5. Check the taskbar

**Expected Results**:
- The window should now allow other windows to appear above it
- The window should STILL be hidden from the taskbar
- The hide-from-taskbar setting should remain unchanged

### Test 3: Hide-From-Taskbar Independence (Requirement 7.3)

**Objective**: Verify changing hide-from-taskbar doesn't affect always-on-top

**Steps**:
1. Open the application settings
2. Enable both "Always on top" and "Hide from taskbar"
3. Verify both are working
4. Disable "Hide from taskbar" toggle
5. Open another application

**Expected Results**:
- The window should now appear in the taskbar
- The window should STILL stay above other applications
- The always-on-top setting should remain unchanged

### Test 4: All Combinations

**Objective**: Verify all four combinations of settings work correctly

**Test Matrix**:

| Always On Top | Hide From Taskbar | Expected Behavior |
|---------------|-------------------|-------------------|
| ✓ Enabled     | ✓ Enabled         | Stays on top, hidden from taskbar |
| ✓ Enabled     | ✗ Disabled        | Stays on top, visible in taskbar |
| ✗ Disabled    | ✓ Enabled         | Normal z-order, hidden from taskbar |
| ✗ Disabled    | ✗ Disabled        | Normal z-order, visible in taskbar |

**Steps for each combination**:
1. Set the toggles according to the test matrix row
2. Open another application
3. Check window behavior and taskbar visibility
4. Verify the behavior matches the expected result

### Test 5: Setting Persistence

**Objective**: Verify settings persist independently across restarts

**Steps**:
1. Set always-on-top to enabled, hide-from-taskbar to disabled
2. Close the application
3. Reopen the application
4. Verify always-on-top is still enabled and hide-from-taskbar is still disabled
5. Set always-on-top to disabled, hide-from-taskbar to enabled
6. Close and reopen the application
7. Verify the new settings are preserved

**Expected Results**:
- Each setting should persist independently
- Restarting the application should not reset or mix up the settings

## Database Verification

You can also verify the settings directly in the database:

1. Open the SQLite database (location varies by platform)
2. Query the app_settings table:
   ```sql
   SELECT * FROM app_settings WHERE key IN ('always_on_top', 'skip_taskbar');
   ```

**Expected Results**:
- Two separate rows should exist
- Each row should have its own independent value ('true' or 'false')
- Changing one setting should only update that row

## Troubleshooting

### If tests fail:

1. **Check database connection**: Ensure the SQLite database is accessible
2. **Check Tauri commands**: Verify `set_always_on_top` and `set_skip_taskbar` commands are registered
3. **Check window API**: Ensure the window object is available and supports both methods
4. **Check for errors**: Look for error messages in the console or application logs

### Common Issues:

- **Settings not persisting**: Check database write permissions
- **Window behavior not changing**: Verify Tauri commands are being called correctly
- **One setting affects the other**: Check for code that might be coupling the two features

## Success Criteria

All tests pass when:
- ✓ Both features can be enabled simultaneously
- ✓ Changing always-on-top doesn't affect hide-from-taskbar
- ✓ Changing hide-from-taskbar doesn't affect always-on-top
- ✓ All four combinations of settings work correctly
- ✓ Settings persist independently across application restarts
- ✓ No errors appear in the console or logs
