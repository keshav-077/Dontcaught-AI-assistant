-- Create app_settings table for storing application preferences
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

-- Index for faster lookups by key
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_app_settings_timestamp 
AFTER UPDATE ON app_settings
FOR EACH ROW
WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE app_settings 
    SET updated_at = datetime('now') 
    WHERE key = NEW.key;
END;

-- Insert default value for skip_taskbar (true = hide from taskbar)
INSERT OR IGNORE INTO app_settings (key, value) VALUES ('skip_taskbar', 'true');
