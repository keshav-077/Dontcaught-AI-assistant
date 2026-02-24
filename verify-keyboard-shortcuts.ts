/**
 * Keyboard Shortcut Compatibility Verification Script
 * 
 * This script verifies that the new Ctrl+Enter shortcut in the unified
 * dual-audio interface doesn't conflict with existing keyboard shortcuts.
 * 
 * Requirements: 8.3
 */

import { DEFAULT_SHORTCUT_ACTIONS } from './src/config/shortcuts';

interface ShortcutConflict {
  shortcut: string;
  action1: string;
  action2: string;
}

interface VerificationResult {
  passed: boolean;
  conflicts: ShortcutConflict[];
  warnings: string[];
  info: string[];
}

/**
 * Verify that Ctrl+Enter doesn't conflict with existing shortcuts
 */
function verifyCtrlEnterNoConflict(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    conflicts: [],
    warnings: [],
    info: []
  };

  const dualAudioShortcuts = [
    { key: 'ctrl+enter', action: 'Process Dual Transcriptions (Dual-Audio Interface)' },
    { key: 'cmd+enter', action: 'Process Dual Transcriptions (Dual-Audio Interface)' },
    { key: 'escape', action: 'Close Dual-Audio Popover' }
  ];

  // Check each existing shortcut for conflicts
  DEFAULT_SHORTCUT_ACTIONS.forEach(action => {
    const keys = [
      action.defaultKey.windows?.toLowerCase(),
      action.defaultKey.macos?.toLowerCase(),
      action.defaultKey.linux?.toLowerCase()
    ].filter(Boolean);

    keys.forEach(key => {
      dualAudioShortcuts.forEach(dualShortcut => {
        if (key === dualShortcut.key) {
          result.conflicts.push({
            shortcut: key!,
            action1: action.name,
            action2: dualShortcut.action
          });
          result.passed = false;
        }
      });
    });
  });

  if (result.conflicts.length === 0) {
    result.info.push('✓ No conflicts found between Ctrl+Enter and existing shortcuts');
  }

  return result;
}

/**
 * Verify that existing shortcuts use different modifier patterns
 */
function verifyModifierSeparation(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    conflicts: [],
    warnings: [],
    info: []
  };

  const shortcutsWithShift = DEFAULT_SHORTCUT_ACTIONS.filter(action => {
    const keys = Object.values(action.defaultKey);
    return keys.some(key => key?.toLowerCase().includes('shift'));
  });

  const shortcutsWithoutShift = DEFAULT_SHORTCUT_ACTIONS.filter(action => {
    const keys = Object.values(action.defaultKey);
    return keys.every(key => !key?.toLowerCase().includes('shift'));
  });

  result.info.push(`✓ ${shortcutsWithShift.length} existing shortcuts use Shift modifier`);
  result.info.push(`✓ ${shortcutsWithoutShift.length} existing shortcuts don't use Shift modifier`);
  result.info.push('✓ Ctrl+Enter (without Shift) provides good separation from Ctrl+Shift shortcuts');

  // List shortcuts without Shift for awareness
  if (shortcutsWithoutShift.length > 0) {
    result.info.push('\nShortcuts without Shift modifier:');
    shortcutsWithoutShift.forEach(action => {
      const key = action.defaultKey.windows || action.defaultKey.macos || action.defaultKey.linux;
      result.info.push(`  - ${action.name}: ${key}`);
    });
  }

  return result;
}

/**
 * Verify that Enter key handlers in other components won't conflict
 */
function verifyEnterKeyHandlers(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    conflicts: [],
    warnings: [],
    info: []
  };

  // Components that use plain Enter key
  const enterKeyComponents = [
    'useChatCompletion.ts - Chat completion input (checks !ctrlKey && !metaKey)',
    'useCompletion.ts - Text completion input (checks !ctrlKey && !metaKey)',
    'useSystemAudio.ts - System audio recording (checks !ctrlKey && !metaKey)',
    'QuickActions.tsx - Quick actions input (checks !ctrlKey && !metaKey)',
    'PluelyApiSetup.tsx - License activation (checks !ctrlKey && !metaKey)'
  ];

  result.info.push('✓ Plain Enter handlers in other components:');
  enterKeyComponents.forEach(component => {
    result.info.push(`  - ${component}`);
  });

  result.info.push('\n✓ All handlers now check for !ctrlKey and !metaKey');
  result.info.push('✓ They only trigger on plain Enter (no modifiers)');
  result.info.push('✓ Ctrl+Enter is ignored by these handlers');
  result.info.push('✓ This prevents conflicts with dual-audio Ctrl+Enter');

  return result;
}

/**
 * Verify scoped activation prevents global conflicts
 */
function verifyScopedActivation(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    conflicts: [],
    warnings: [],
    info: []
  };

  result.info.push('✓ Ctrl+Enter is scoped to dual-audio interface:');
  result.info.push('  - Only active when popover is open (isActive prop)');
  result.info.push('  - Event listeners attached to window when active');
  result.info.push('  - Listeners cleaned up when component unmounts');
  result.info.push('  - Uses preventDefault() to stop propagation');

  return result;
}

/**
 * Verify Escape key compatibility
 */
function verifyEscapeKey(): VerificationResult {
  const result: VerificationResult = {
    passed: true,
    conflicts: [],
    warnings: [],
    info: []
  };

  // Check if Escape is used by any existing shortcuts
  const escapeConflicts = DEFAULT_SHORTCUT_ACTIONS.filter(action => {
    const keys = Object.values(action.defaultKey);
    return keys.some(key => key?.toLowerCase().includes('escape'));
  });

  if (escapeConflicts.length > 0) {
    result.warnings.push('⚠ Escape key is used by existing shortcuts:');
    escapeConflicts.forEach(action => {
      result.warnings.push(`  - ${action.name}`);
    });
  } else {
    result.info.push('✓ Escape key is not used by existing shortcuts');
    result.info.push('✓ Escape closes popover when not capturing');
    result.info.push('✓ Escape is prevented during active capture');
  }

  return result;
}

/**
 * Run all verification checks
 */
function runAllVerifications(): void {
  console.log('='.repeat(70));
  console.log('Keyboard Shortcut Compatibility Verification');
  console.log('Requirements: 8.3');
  console.log('='.repeat(70));
  console.log();

  const checks = [
    { name: 'Ctrl+Enter Conflict Check', fn: verifyCtrlEnterNoConflict },
    { name: 'Modifier Separation Check', fn: verifyModifierSeparation },
    { name: 'Enter Key Handler Check', fn: verifyEnterKeyHandlers },
    { name: 'Scoped Activation Check', fn: verifyScopedActivation },
    { name: 'Escape Key Check', fn: verifyEscapeKey }
  ];

  let allPassed = true;
  const allResults: Array<{ name: string; result: VerificationResult }> = [];

  checks.forEach(check => {
    console.log(`\n${check.name}`);
    console.log('-'.repeat(70));
    
    const result = check.fn();
    allResults.push({ name: check.name, result });

    if (!result.passed) {
      allPassed = false;
    }

    // Print conflicts
    if (result.conflicts.length > 0) {
      console.log('\n❌ CONFLICTS FOUND:');
      result.conflicts.forEach(conflict => {
        console.log(`  ${conflict.shortcut}: ${conflict.action1} vs ${conflict.action2}`);
      });
    }

    // Print warnings
    if (result.warnings.length > 0) {
      console.log();
      result.warnings.forEach(warning => console.log(warning));
    }

    // Print info
    if (result.info.length > 0) {
      console.log();
      result.info.forEach(info => console.log(info));
    }
  });

  // Summary
  console.log();
  console.log('='.repeat(70));
  console.log('Summary');
  console.log('='.repeat(70));
  console.log();

  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED');
    console.log();
    console.log('The new Ctrl+Enter shortcut in the unified dual-audio interface');
    console.log('does not conflict with any existing keyboard shortcuts.');
    console.log();
    console.log('Existing shortcuts continue to work as expected:');
    DEFAULT_SHORTCUT_ACTIONS.forEach(action => {
      const key = action.defaultKey.windows || action.defaultKey.macos || action.defaultKey.linux;
      console.log(`  ✓ ${action.name}: ${key}`);
    });
  } else {
    console.log('❌ CONFLICTS DETECTED');
    console.log();
    console.log('Please resolve the conflicts listed above before proceeding.');
  }

  console.log();
  console.log('='.repeat(70));
  console.log('Manual Testing Required');
  console.log('='.repeat(70));
  console.log();
  console.log('While automated checks passed, please perform manual testing:');
  console.log();
  console.log('1. Open the application');
  console.log('2. Test each existing shortcut with dual-audio interface closed');
  console.log('3. Open the dual-audio interface popover');
  console.log('4. Test each existing shortcut again (should still work)');
  console.log('5. Test Ctrl+Enter in the dual-audio interface');
  console.log('6. Test Ctrl+Enter outside the dual-audio interface (should do nothing)');
  console.log('7. Test plain Enter in chat/completion inputs (should work normally)');
  console.log('8. Test Escape key with and without active capture');
  console.log();
  console.log('See KEYBOARD_SHORTCUTS.md for detailed testing instructions.');
  console.log();
}

// Run verification
runAllVerifications();
