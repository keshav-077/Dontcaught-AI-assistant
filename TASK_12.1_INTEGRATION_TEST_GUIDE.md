# Task 12.1 Integration Test - Quick Start Guide

## Overview

This guide helps you complete Task 12.1: Test complete user flow for the always-on-top feature.

**Requirements Tested:** 1.3, 1.4, 2.4, 3.2, 7.1

## Quick Start

### Option 1: Interactive Test Page (Recommended)

1. Build and run the application:
   ```bash
   npm run build
   npm run tauri dev
   ```

2. Open the interactive test page in the application:
   - Navigate to: `test-integration-task-12.1.html`
   - Or open it in your browser while the app is running

3. Follow the guided test procedures on the page

4. Mark each test as complete or failed as you go

### Option 2: Manual Checklist

1. Open `INTEGRATION_TEST_TASK_12.1.md`

2. Follow each test section in order:
   - Test 1: Toggle Always-On-Top Multiple Times
   - Test 2: Setting Persistence Across Restarts
   - Test 3: Always-On-Top Works with Hide-From-Taskbar
   - Test 4: Window Stays On Top When Other Applications Are Opened
   - Test 5: Complete End-to-End User Flow

3. Check off each item as you complete it

4. Document any issues in the Notes section

## Test Requirements Summary

### Test 1: Toggle Multiple Times (Requirement 2.4)
- Verify immediate application of setting changes
- No restart required
- Consistent behavior across multiple toggles

### Test 2: Persistence (Requirement 3.2)
- Setting persists when app is closed and reopened
- Works for both enabled and disabled states
- Multiple restart cycles maintain correct state

### Test 3: Feature Interaction (Requirement 7.1)
- Always-on-top works with hide-from-taskbar
- Both features can be enabled simultaneously
- Changing one doesn't affect the other

### Test 4: Window Behavior (Requirements 1.3, 1.4)
- Window stays on top of all other applications
- Works with multiple applications open
- Consistent behavior during rapid app switching

### Test 5: Complete User Flow (All Requirements)
- End-to-end testing from first launch to daily use
- Settings customization and persistence
- Real-world usage scenarios

## Expected Results

All tests should pass with:
- ✓ No errors in console
- ✓ No crashes or unexpected behavior
- ✓ Immediate response to setting changes
- ✓ Correct persistence across restarts
- ✓ Independent operation of both features
- ✓ Window stays on top when enabled
- ✓ Normal z-order when disabled

## Troubleshooting

### If tests fail:

1. **Check console for errors** (F12 in the app)
2. **Verify database** - Check that `always_on_top` setting exists
3. **Check Tauri commands** - Ensure backend commands are registered
4. **Platform-specific issues** - Some behavior may vary by OS

### Common Issues:

- **Setting doesn't persist**: Check database write permissions
- **Window doesn't stay on top**: Verify Tauri window API is working
- **Toggle doesn't respond**: Check for JavaScript errors in console
- **Features interfere**: Verify independent database entries

## Database Verification

To manually check the database:

```sql
SELECT * FROM app_settings WHERE key IN ('always_on_top', 'skip_taskbar');
```

Expected output:
```
key             | value
----------------|-------
always_on_top   | true
skip_taskbar    | true
```

## Completion Criteria

Task 12.1 is complete when:

- [ ] All 5 manual tests are completed
- [ ] All automated tests pass (if running in Tauri app)
- [ ] No critical issues found
- [ ] All requirements (1.3, 1.4, 2.4, 3.2, 7.1) are verified
- [ ] Documentation updated with test results

## Next Steps

After completing Task 12.1:

1. Update task status in `.kiro/specs/always-on-top/tasks.md`
2. Document any issues found
3. Proceed to Task 12.2 (optional integration tests) if needed
4. Or proceed to Task 13 (final checkpoint)

## Related Documents

- **Detailed Test Plan**: `INTEGRATION_TEST_TASK_12.1.md`
- **Interactive Test Page**: `test-integration-task-12.1.html`
- **Feature Interaction Tests**: `FEATURE_INTERACTION_TEST.md`
- **Manual Test Checklist**: `MANUAL_TEST_CHECKLIST.md`
- **Requirements**: `.kiro/specs/always-on-top/requirements.md`
- **Design**: `.kiro/specs/always-on-top/design.md`

## Support

If you encounter issues during testing:

1. Check the troubleshooting section above
2. Review the requirements and design documents
3. Check existing test documentation for similar issues
4. Document the issue for further investigation

---

**Remember:** This is integration testing, so some tests require manual verification of window behavior and system interactions. Take your time and verify each behavior carefully.
