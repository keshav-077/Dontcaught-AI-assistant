/**
 * Test runner for feature interaction tests
 * 
 * This script can be run from the browser console or as a standalone test
 * to verify that always-on-top and hide-from-taskbar features work independently.
 */

import { runFeatureInteractionTests } from './lib/database/app-settings.action.test';

// Run tests when this module is imported
if (typeof window !== 'undefined') {
  // Browser environment - expose test runner globally
  (window as any).runFeatureInteractionTests = runFeatureInteractionTests;
  console.log('Feature interaction tests loaded. Run: runFeatureInteractionTests()');
} else {
  // Node environment - run tests immediately
  runFeatureInteractionTests()
    .then(() => {
      console.log('All tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Tests failed:', error);
      process.exit(1);
    });
}
