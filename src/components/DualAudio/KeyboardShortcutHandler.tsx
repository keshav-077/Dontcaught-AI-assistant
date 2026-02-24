import { useEffect } from "react";

interface KeyboardShortcutHandlerProps {
  isActive: boolean;
  isCapturing: boolean;
  onCtrlEnter: () => void;
  onEscape: () => void;
}

/**
 * KeyboardShortcutHandler component
 * 
 * Handles keyboard shortcuts for the dual-audio interface:
 * - Ctrl+Enter: Triggers LLM processing with dual transcriptions
 * - Escape: Closes the popover (when not capturing)
 * 
 * Requirements: 4.1, 4.3, 4.5
 */
export function KeyboardShortcutHandler({
  isActive,
  isCapturing,
  onCtrlEnter,
  onEscape,
}: KeyboardShortcutHandlerProps) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Enter: Process transcriptions and navigate to LLM response
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        onCtrlEnter();
      }

      // Escape: Close popover (only when not capturing)
      if (event.key === "Escape" && !isCapturing) {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, isCapturing, onCtrlEnter, onEscape]);

  // This component doesn't render anything
  return null;
}
