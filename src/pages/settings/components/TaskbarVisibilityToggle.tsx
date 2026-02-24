import { Switch, Label, Header } from "@/components";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { updateSkipTaskbar, getCustomizableState } from "@/lib/storage";
import { getSkipTaskbarSetting, saveSkipTaskbarSetting } from "@/lib/database";

interface TaskbarVisibilityToggleProps {
  className?: string;
}

export const TaskbarVisibilityToggle = ({
  className,
}: TaskbarVisibilityToggleProps) => {
  const [skipTaskbar, setSkipTaskbar] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial state from database on mount
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load skip_taskbar setting from database
        const value = await getSkipTaskbarSetting();
        setSkipTaskbar(value);
        
        // Apply the setting to the window immediately
        await invoke("set_skip_taskbar", { skip: value });
      } catch (err) {
        console.error("Failed to load skip taskbar setting:", err);
        setError("Failed to load setting");
        // Fall back to local storage or default
        const localState = getCustomizableState();
        setSkipTaskbar(localState.skipTaskbar.isEnabled);
      } finally {
        setLoading(false);
      }
    };

    loadInitialState();
  }, []);

  const handleSwitchChange = async (checked: boolean) => {
    try {
      setError(null);
      
      // Update window property immediately via backend
      await invoke("set_skip_taskbar", { skip: checked });
      
      // Update local state
      setSkipTaskbar(checked);
      
      // Persist to database
      await saveSkipTaskbarSetting(checked);
      
      // Update local storage as backup
      updateSkipTaskbar(checked);
    } catch (err) {
      console.error("Failed to update skip taskbar setting:", err);
      setError("Failed to update setting");
      // Revert local state on error
      setSkipTaskbar(!checked);
    }
  };

  return (
    <div id="taskbar-visibility" className={`space-y-2 ${className}`}>
      <Header
        title="Taskbar Visibility"
        description="Control whether the application appears in the system taskbar"
        isMainTitle
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <Label className="text-sm font-medium">
              {skipTaskbar
                ? "Hide from taskbar"
                : "Show in taskbar"}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {skipTaskbar
                ? "Application is hidden from taskbar for discretion"
                : "Application appears in taskbar like normal apps"}
            </p>
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>
        </div>
        <Switch
          checked={skipTaskbar}
          onCheckedChange={handleSwitchChange}
          disabled={loading}
          title={`Toggle to ${skipTaskbar ? "show" : "hide"} in taskbar`}
          aria-label={`Toggle to ${skipTaskbar ? "show" : "hide"} in taskbar`}
        />
      </div>
    </div>
  );
};
