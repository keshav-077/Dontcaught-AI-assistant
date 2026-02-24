/**
 * Integration tests for feature interaction between always-on-top and hide-from-taskbar
 * 
 * These tests verify Requirements 7.1, 7.2, 7.3:
 * - Both settings can be enabled simultaneously
 * - Changing one setting doesn't affect the other
 * - Settings maintain independence
 */

import { 
  getAlwaysOnTopSetting, 
  saveAlwaysOnTopSetting,
  getSkipTaskbarSetting,
  saveSkipTaskbarSetting 
} from './app-settings.action';

/**
 * Test: Both settings can be enabled simultaneously (Requirement 7.1)
 */
export async function testSimultaneousFeatures(): Promise<void> {
  console.log('Testing simultaneous feature operation...');
  
  // Enable both features
  await saveAlwaysOnTopSetting(true);
  await saveSkipTaskbarSetting(true);
  
  // Verify both are enabled
  const alwaysOnTop = await getAlwaysOnTopSetting();
  const skipTaskbar = await getSkipTaskbarSetting();
  
  if (alwaysOnTop !== true || skipTaskbar !== true) {
    throw new Error(`Both features should be enabled. Got alwaysOnTop=${alwaysOnTop}, skipTaskbar=${skipTaskbar}`);
  }
  
  console.log('✓ Both features can be enabled simultaneously');
}

/**
 * Test: Changing always-on-top doesn't affect skip-taskbar (Requirement 7.2)
 */
export async function testAlwaysOnTopIndependence(): Promise<void> {
  console.log('Testing always-on-top independence...');
  
  // Set initial state: both enabled
  await saveAlwaysOnTopSetting(true);
  await saveSkipTaskbarSetting(true);
  
  // Change always-on-top to false
  await saveAlwaysOnTopSetting(false);
  
  // Verify skip-taskbar is still true
  const skipTaskbar = await getSkipTaskbarSetting();
  const alwaysOnTop = await getAlwaysOnTopSetting();
  
  if (skipTaskbar !== true) {
    throw new Error(`Skip taskbar should remain true. Got skipTaskbar=${skipTaskbar}`);
  }
  
  if (alwaysOnTop !== false) {
    throw new Error(`Always on top should be false. Got alwaysOnTop=${alwaysOnTop}`);
  }
  
  console.log('✓ Changing always-on-top does not affect skip-taskbar');
}

/**
 * Test: Changing skip-taskbar doesn't affect always-on-top (Requirement 7.3)
 */
export async function testSkipTaskbarIndependence(): Promise<void> {
  console.log('Testing skip-taskbar independence...');
  
  // Set initial state: both enabled
  await saveAlwaysOnTopSetting(true);
  await saveSkipTaskbarSetting(true);
  
  // Change skip-taskbar to false
  await saveSkipTaskbarSetting(false);
  
  // Verify always-on-top is still true
  const alwaysOnTop = await getAlwaysOnTopSetting();
  const skipTaskbar = await getSkipTaskbarSetting();
  
  if (alwaysOnTop !== true) {
    throw new Error(`Always on top should remain true. Got alwaysOnTop=${alwaysOnTop}`);
  }
  
  if (skipTaskbar !== false) {
    throw new Error(`Skip taskbar should be false. Got skipTaskbar=${skipTaskbar}`);
  }
  
  console.log('✓ Changing skip-taskbar does not affect always-on-top');
}

/**
 * Test: All combinations of settings work correctly
 */
export async function testAllCombinations(): Promise<void> {
  console.log('Testing all setting combinations...');
  
  const combinations = [
    { alwaysOnTop: true, skipTaskbar: true },
    { alwaysOnTop: true, skipTaskbar: false },
    { alwaysOnTop: false, skipTaskbar: true },
    { alwaysOnTop: false, skipTaskbar: false },
  ];
  
  for (const combo of combinations) {
    await saveAlwaysOnTopSetting(combo.alwaysOnTop);
    await saveSkipTaskbarSetting(combo.skipTaskbar);
    
    const retrievedAlwaysOnTop = await getAlwaysOnTopSetting();
    const retrievedSkipTaskbar = await getSkipTaskbarSetting();
    
    if (retrievedAlwaysOnTop !== combo.alwaysOnTop || retrievedSkipTaskbar !== combo.skipTaskbar) {
      throw new Error(
        `Combination failed. Expected alwaysOnTop=${combo.alwaysOnTop}, skipTaskbar=${combo.skipTaskbar}. ` +
        `Got alwaysOnTop=${retrievedAlwaysOnTop}, skipTaskbar=${retrievedSkipTaskbar}`
      );
    }
  }
  
  console.log('✓ All setting combinations work correctly');
}

/**
 * Run all feature interaction tests
 */
export async function runFeatureInteractionTests(): Promise<void> {
  console.log('=== Running Feature Interaction Tests ===\n');
  
  try {
    await testSimultaneousFeatures();
    await testAlwaysOnTopIndependence();
    await testSkipTaskbarIndependence();
    await testAllCombinations();
    
    console.log('\n=== All Feature Interaction Tests Passed ===');
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error(error);
    throw error;
  }
}
