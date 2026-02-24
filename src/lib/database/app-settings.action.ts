import { getDatabase } from "./config";

/**
 * Get always_on_top setting from database
 * @returns boolean value of the setting, or true (default) if not found
 */
export async function getAlwaysOnTopSetting(): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db.select<Array<{ value: string }>>(
      "SELECT value FROM app_settings WHERE key = 'always_on_top'"
    );

    if (result.length > 0) {
      return result[0].value === "true";
    }

    // Return default value (true) if no preference exists
    return true;
  } catch (error) {
    console.error("Failed to get always_on_top setting:", error);
    // Return default value on error
    return true;
  }
}

/**
 * Save always_on_top setting to database
 * @param value - boolean value to save
 */
export async function saveAlwaysOnTopSetting(value: boolean): Promise<void> {
  const db = await getDatabase();
  const stringValue = value ? "true" : "false";

  await db.execute(
    "INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES ('always_on_top', $1, datetime('now'))",
    [stringValue]
  );
}

/**
 * Get skip_taskbar setting from database
 * @returns boolean value of the setting, or true (default) if not found
 */
export async function getSkipTaskbarSetting(): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db.select<Array<{ value: string }>>(
      "SELECT value FROM app_settings WHERE key = 'skip_taskbar'"
    );

    if (result.length > 0) {
      return result[0].value === "true";
    }

    // Return default value (true) if no preference exists
    return true;
  } catch (error) {
    console.error("Failed to get skip_taskbar setting:", error);
    // Return default value on error
    return true;
  }
}

/**
 * Save skip_taskbar setting to database
 * @param value - boolean value to save
 */
export async function saveSkipTaskbarSetting(value: boolean): Promise<void> {
  const db = await getDatabase();
  const stringValue = value ? "true" : "false";

  await db.execute(
    "INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES ('skip_taskbar', $1, datetime('now'))",
    [stringValue]
  );
}
