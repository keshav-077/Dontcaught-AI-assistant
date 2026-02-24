import { Switch, Label, Header } from "@/components";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { updateAlwaysOnTop, getCustomizableState } from "@/lib/storage";
import { getAlwaysOnTopSetting, saveAlwaysOnTopSetting } from "@/lib/database";

interface AlwaysOnTopToggleProps {
  className?: string;
}

export const AlwaysOnTopToggle = ({
  className,
}: AlwaysOnTopToggleProps) => {
  const [alwaysOnTop, setAlwaysOnTop] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Load initial state from database on component mount
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load always_on_top setting from database
        const value = await getAlwaysOnTopSetting();
        setAlwaysOnTop(value);
        
        // Apply the setting to the window immediately
        await invoke("set_always_on_top", { alwaysOnTop: value });
      } catch (err) {
        console.error("Failed to load always on top setting:", err);
        
        // Check if the error indicates unsupported platform
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes("not supported") || errorMessage.includes("unsupported")) {
          setIsSupported(false);
          setError("Always-on-top is not supported on this platform");
        } else {
          setError("Failed to load setting");
        }
        
        // Fall back to local storage or default
        const localState = getCustomizableState();
        setAlwaysOnTop(localState.alwaysOnTop.isEnabled);
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
      await invoke("set_always_on_top", { alwaysOnTop: checked });
      
      // Update local state
      setAlwaysOnTop(checked);
      
      // Persist to database
      await saveAlwaysOnTopSetting(checked);
      
      // Update local storage as backup
      updateAlwaysOnTop(checked);
    } catch (err) {
      console.error("Failed to update always on top setting:", err);
      
      // Check if the error indicates unsupported platform
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("not supported") || errorMessage.includes("unsupported")) {
        setIsSupported(false);
        setError("Always-on-top is not supported on this platform");
      } else {
        setError("Failed to update setting");
      }
      
      // Revert local state on error
      setAlwaysOnTop(!checked);
    }
  };

  return (
    <div id="always-on-top" className={`space-y-2 ${className}`}>
      <Header
        title="Always On Top"
        description="Control whether the window stays above all other applications"
        isMainTitle
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <Label className="text-sm font-medium">
              Always on top
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {!isSupported
                ? "This feature is not available on your platform"
                : alwaysOnTop
                ? "Window stays above all other applications"
                : "Window behaves like normal applications"}
            </p>
            {error && (
              <p className="text-xs text-destructive mt-1">{error}</p>
            )}
          </div>
        </div>
        <Switch
          checked={alwaysOnTop}
          onCheckedChange={handleSwitchChange}
          disabled={loading || !isSupported}
          title={
            !isSupported
              ? "Always-on-top is not supported on this platform"
              : `Toggle to ${alwaysOnTop ? "disable" : "enable"} always on top`
          }
          aria-label={
            !isSupported
              ? "Always-on-top is not supported on this platform"
              : `Toggle to ${alwaysOnTop ? "disable" : "enable"} always on top`
          }
        />
      </div>
    </div>
  );
};
