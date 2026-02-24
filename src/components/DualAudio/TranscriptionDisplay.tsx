import { useEffect, useRef } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks";
import { cn } from "@/lib/utils";

interface TranscriptionDisplayProps {
  text: string;
  isProcessing: boolean;
  placeholder?: string;
}

export function TranscriptionDisplay({
  text,
  isProcessing,
  placeholder = "Transcription will appear here...",
}: TranscriptionDisplayProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isCopied, handleCopy } = useCopyToClipboard({
    text,
    copyMessage: "Transcription copied!",
  });

  // Auto-scroll to bottom when text updates
  useEffect(() => {
    if (contentRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-slot='scroll-area-viewport']"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [text]);

  const isEmpty = !text || text.trim().length === 0;
  const showCopyButton = !isEmpty && !isProcessing;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Copy button - positioned absolutely in top-right with smooth animation */}
      {showCopyButton && (
        <div className="absolute top-2 right-2 z-10 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background transition-all duration-200"
            aria-label="Copy transcription to clipboard"
            onClick={handleCopy}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Check
                className={cn(
                  "h-4 w-4 transition-all duration-200 ease-in-out",
                  isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
            </div>
            <Copy
              className={cn(
                "h-4 w-4 transition-all duration-200 ease-in-out",
                isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            />
          </Button>
        </div>
      )}

      {/* Scrollable text area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 w-full">
        <div
          ref={contentRef}
          className={cn(
            "p-4 min-h-full",
            isEmpty && "flex items-center justify-center"
          )}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground animate-in fade-in-0 duration-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          ) : isEmpty ? (
            <p className="text-sm text-muted-foreground text-center animate-in fade-in-0 duration-300">
              {placeholder}
            </p>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words animate-in fade-in-0 slide-in-from-bottom-2 duration-300">{text}</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
