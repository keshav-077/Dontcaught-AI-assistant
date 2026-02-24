import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DualPaneContainer } from "./DualPaneContainer";
import { KeyboardShortcutHandler } from "./KeyboardShortcutHandler";
import { XIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface DualAudioPopoverProps {
  // Trigger button
  trigger: ReactNode;
  
  // Open/close state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Pane content
  systemAudioPane: ReactNode;
  microphonePane: ReactNode;
  
  // Keyboard shortcut handlers
  isCapturing: boolean;
  onCtrlEnter: () => void;
  onEscape: () => void;
}

/**
 * DualAudioPopover component
 * 
 * Main popover container for the unified dual-audio interface.
 * Displays both audio sources side-by-side with keyboard shortcuts.
 * 
 * Requirements: 1.1, 1.2, 4.1, 5.1
 */
export function DualAudioPopover({
  trigger,
  open,
  onOpenChange,
  systemAudioPane,
  microphonePane,
  isCapturing,
  onCtrlEnter,
  onEscape,
}: DualAudioPopoverProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>

        <PopoverContent
          className="w-[800px] max-w-[90vw] p-0 animate-in fade-in-0 zoom-in-95 duration-200"
          align="center"
          sideOffset={8}
        >
          {/* Header with title and close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-base font-semibold">Dual Audio Capture</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClose}
              className="h-8 w-8"
              title="Close (Esc)"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Main content - Dual pane container */}
          <div className="p-4">
            <DualPaneContainer
              systemAudioPane={systemAudioPane}
              microphonePane={microphonePane}
            />
          </div>

          {/* Footer with device selection link and Ctrl+Enter hint */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <Link
              to="/audio"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Audio Device Settings</span>
            </Link>
            
            <div className="text-xs text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-background border border-border rounded text-foreground font-mono">Ctrl+Enter</kbd> to process
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Keyboard shortcut handler */}
      <KeyboardShortcutHandler
        isActive={open}
        isCapturing={isCapturing}
        onCtrlEnter={onCtrlEnter}
        onEscape={onEscape}
      />
    </>
  );
}
